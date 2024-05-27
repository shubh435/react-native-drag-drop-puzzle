import React, { Component } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';


// Utility functions for getting position and order
const MARGIN = 10;
const ITEM_SIZE =100+ MARGIN;

const getPosition = (order) => ({
  x: (order % 3) * ITEM_SIZE,
  y: Math.floor(order / 3) * ITEM_SIZE,
});

const getOrder = (translateX, translateY) => {
  const row = Math.round(translateY / ITEM_SIZE ) ;
  const col = Math.round(translateX / ITEM_SIZE) ;
  return row * 3 + col;
};



export default  class Draggable extends Component {
  constructor(props) {
    super(props);

    const position = this.props.positions[this.props.id] != null ? getPosition(this.props.positions[this.props.id]) : { x: 0, y: 0 };
    this.translateX = new Animated.Value(position.x);
    this.translateY = new Animated.Value(position.y);
    this.state = {
      isGestureActive: false,
      translateX:new Animated.Value(position.x ),
      translateY:new Animated.Value(position.y)
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.setState({ isGestureActive: true });
        this.translateX.setOffset(this.translateX._value);
        this.translateY.setOffset(this.translateY._value);
        this.translateX.setValue(0);
        this.translateY.setValue(0);
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: this.translateX, dy: this.translateY },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ isGestureActive: false });
        this.translateX .flattenOffset();
        this.translateY .flattenOffset()

        const { id, positions, onPositionsChange } = this.props;
        const newOrder = getOrder(gestureState.moveX , gestureState.moveY);
        const oldOrder = positions[id];

        if (oldOrder !== newOrder) {
          const idToSwap = Object.keys(positions).find(
            (key) => positions[key] === newOrder
          );
          if (idToSwap) {
            const newPositions = { ...positions };
            newPositions[id] = newOrder;
            newPositions[idToSwap] = oldOrder;
            onPositionsChange(newPositions);
          }
        }

        const destination = getPosition(positions[id]);
        Animated.spring(this.translateX, {
          toValue: destination.x,
          useNativeDriver: false,
        }).start();
        Animated.spring(this.translateY, {
          toValue: destination.y,
          useNativeDriver: false,
        }).start();
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.positions[this.props.id] !== this.props.positions[this.props.id]) {
      const position = getPosition(this.props.positions[this.props.id]);
      Animated.spring(this.translateX, {
        toValue: position.x,
        useNativeDriver: false,
      }).start();
      Animated.spring(this.translateY, {
        toValue: position.y,
        useNativeDriver: false,
      }).start();
    }
  }

  render() {
    const { children } = this.props;
    const animatedStyle = {
      zIndex: this.state.isGestureActive ? 1000 : 1,
      transform: [
        { translateX: this.translateX },
        { translateY: this.translateY },
        { scale: this.state.isGestureActive ? 1.1 : 1 },
      ],
    };

    return (
      <Animated.View style={[styles.draggable, animatedStyle]} {...this.panResponder.panHandlers}>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: MARGIN / 2,
  },
  image: {
    width: 100,
    height: 100,
    margin: MARGIN / 2,
  },
  draggable: {
    position: 'absolute',
    margin: MARGIN * 2,
  },
});