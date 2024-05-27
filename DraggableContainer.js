import React, { Component } from 'react';
import { View, Animated, PanResponder, StyleSheet, Image } from 'react-native';
import Draggable from './draggable1';
// Dummy images array with unique ids
const images = [
  {
    id: '1',
    description: 'Lady with a Teddy',
    uri: 'https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg',
  },
  {
    id: '1111',
    description: 'Girl with camera',
    uri: 'https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg',
  },
  {
    id: '3',
    description: 'Beautiful Girl with Glasses',
    uri: 'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg',
  },
  {
    id: '4',
    description: 'Redhead with freckles',
    uri: 'https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg',
  },
  {
    id: '5',
    description: 'Girl in black dress',
    uri: 'https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg',
  },
  {
    id: '6',
    description: 'Girl Sitting on Chair',
    uri: 'https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg',
  },
];

// Utility functions for getting position and order
const MARGIN = 10;


class DraggableContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positions: {},
    };
  }

  handlePositionsChange = (positions) => {
    this.setState({ positions });
  };

  componentDidMount(){
    this.handlePositionsChange(images.reduce((acc, image, index) => {
      acc[image.id] = index;
      return acc;
    }, {}))
  }
  render() {
    const { positions } = this.state;
console.log("----+++++>>>>>>",images.reduce((acc, image, index) => {
  acc[image.id] = index;
  return acc;
}, {}));
    return (
      <View style={styles.container}>
        {images.map((image) => (
          <Draggable
            key={image.id}
            id={image.id}
            positions={positions}
            onPositionsChange={this.handlePositionsChange}
          >
            <Image source={{ uri: image.uri }} style={styles.image} />
          </Draggable>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: MARGIN / 2,
    alignItems:"center"
  },
  image: {
    width: 100,
    height: 100,
    margin: MARGIN / 2,
  },
  draggable: {
    position: 'absolute',
    margin: MARGIN * 5,
  },
});

export default DraggableContainer;
