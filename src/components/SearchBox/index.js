import './search-box-component.css';
import React from 'react';
import SearchIcon from '../../assets/svgs/searchIcon.svg';

const SearchBox = ({ onChangeText }) => (
  <div className="search-component w-[300px]">
    <img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/searchIcon.svg"} className="search-icon" />
    <input
      onChange={text => onChangeText(text.target.value)}
      placeholder="Search here"
      className="search-input"
    />
  </div>
);

export default SearchBox;
