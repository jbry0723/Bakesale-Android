import React from "react";
import PropTypes from "prop-types";
import { TextInput, StyleSheet, View } from "react-native";
import debounce from "lodash.debounce";
import DealList from "./DealList";

class SearchBar extends React.Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
    initialSearchTerm: PropTypes.string.isRequired,
  };
  state = {
    searchTerm: this.props.initialSearchTerm,
  };
  searchDeals = (searchTerm) => {
    this.props.searchDeals(searchTerm);
    this.inputElement.blur();
    //blur
  };

  debouncedSearchDeals = debounce(this.searchDeals, 700);
  handleChange = (searchTerm) => {
    this.setState({ searchTerm }, () => {
      this.debouncedSearchDeals(this.state.searchTerm);
    });
  };
  render() {
    return (
      <TextInput
        value={this.state.searchTerm}
        ref={(inputElement) => {
          this.inputElement = inputElement;
        }}
        style={styles.input}
        placeholder="Search All Deals"
        onChangeText={this.handleChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});

export default SearchBar;
