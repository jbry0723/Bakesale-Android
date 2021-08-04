import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

import { priceDisplay } from "../util";


class DealItem extends React.Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  render() {
    const { deal,  onPress } = this.props;
    const handlePress = () => {
      onPress(this.props.deal.key);
    };
    return (
      <View style={styles.deal}>
        <TouchableOpacity style={styles.info} onPress={handlePress}>
          <Image
            source={{ uri: deal.media[0] }}
            style={styles.image}
          />

          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.footer}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: 150,
  },
  info: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#bbb",
    borderWidth: 1,
    borderTopWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: "right",
  },
});

export default DealItem
