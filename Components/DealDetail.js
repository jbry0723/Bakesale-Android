import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  Linking,
  FlatList,
  ScrollView,
} from "react-native";
import ajax from "../ajax";
import Icon from "react-native-vector-icons/FontAwesome";

import { priceDisplay } from "../util";

class DealDetail extends React.Component {
  imageXPos = new Animated.Value(0);
  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get("window").width;
      if (Math.abs(gs.dx) > this.width * 0.4) {
        const direction = Math.sign(gs.dx);
        //-1 for left, 1 for right
        Animated.timing(this.imageXPos, {
          //animation for SWIPING (the image moving with finger)
          toValue: direction * this.width,
          duration: 250,
          useNativeDriver: false,
        }).start(() => this.handleSwipe(-1 * direction)); //index direction for handleswipe is REVERSE of index direction for swipe animation
      } else {
        Animated.spring(this.imageXPos, {
          //reset if swipe isn't as long as 40% of screen
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  handleSwipe = (indexDirection) => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      //reset if next image doesn't exist
      Animated.spring(this.imageXPos, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      return;
    }
    this.setState(
      (prevState) => ({
        imageIndex: prevState.imageIndex + indexDirection,
      }),
      () => {
        //animation for the new image appearing (or not appearing if nonexistant) following swipe
        this.imageXPos.setValue(indexDirection * this.width);
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    );
  };

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };
  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };
  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    this.setState({
      deal: fullDeal,
    });
  }
  openDealURL = () => {
    Linking.openURL(this.state.deal.url);
  };
  render() {
    const { deal } = this.state;
    return (
      <View style={styles.deal}>
        <ScrollView>
          <TouchableOpacity onPress={this.props.onBack}>
            <Text style={styles.backlink}>Back</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Animated.Image
              {...this.imagePanResponder.panHandlers}
              source={{ uri: deal.media[this.state.imageIndex] }}
              style={[{ left: this.imageXPos }, styles.image]}
            ></Animated.Image>
            <View style={styles.overlayContainer}>
              <Icon
                style={styles.chevronLeft}
                name="chevron-circle-left"
                size={30}
                color="#D3D3D3"
              />
              <Icon
                style={styles.chevronRight}
                name="chevron-circle-right"
                size={30}
                color="#D3D3D3"
              />
            </View>
          </View>

          <View style={styles.detail}>
            <View>
              <Text style={styles.title}>{deal.title}</Text>
            </View>
            <View style={styles.footer}>
              <View style={styles.info}>
                <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
                <Text style={styles.cause}>{deal.cause.name}</Text>
              </View>
              {deal.user && (
                <View style={styles.user}>
                  <Image
                    source={{ uri: deal.user.avatar }}
                    style={styles.avatar}
                  />
                  <Text>{deal.user.name}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.description}>
            <Text>{deal.description}</Text>
          </View>
          <Button
            style={styles.buyButton}
            title="Buy this deal!"
            onPress={this.openDealURL}
          ></Button>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  chevronLeft: { marginRight: "80%", opacity: 0.4 },
  chevronRight: { opacity: 0.4 },

  backlink: {
    marginBottom: 5,
    color: "#22f",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
    backgroundColor: "rgba(237,149,45,0.4)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15,
  },
  info: {
    alignItems: "center",
  },
  user: {
    alignItems: "center",
  },
  cause: {
    marginVertical: 10,
  },
  price: {
    fontWeight: "bold",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  description: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderStyle: "dotted",
    margin: 10,
    padding: 10,
  },
  deal: { marginBottom: 20 },
});

export default DealDetail;
