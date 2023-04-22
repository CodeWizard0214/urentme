import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';
import { BsSearch } from "react-icons/bs";
import DatetimeRangePicker from 'react-datetime-range-picker';

import * as APIHandler from '../../apis/APIHandler';
import AppSpinner from '../../components/loading/AppSpinner';
import ItemSearchCard from '../../components/elements/ItemSearchCard';
import { getAllItems } from '../../store/actions/itemActions';
import { getDefaultImageUri, getUserAvatar } from '../../utils/imageUrl';
import { getLocation } from '../../utils/stringUtils';
import { MAX_NEARBY_COUNTS, NEARBY_RADIUS } from '../../constants/constant';
import styles from './SearchListSection.module.css';

const SearchListSection = (props) => {
  const { search, tag, onSearchItems, allItems, allItemImages, wishItems, getAllItems } = props;
  const [items, setItems] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchKey, setSearchKey] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  let curr = new Date();
  const [beginDate, setBeginDate] = useState(moment(new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 8, 0, 0, 0)).add(2, 'day'));
  const [endDate, setEndDate] = useState(moment(new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 8, 0, 0, 0)).add(4, 'day'));
  const [status, setStatus] = useState("No Items");
  const RENDER_COUNT = 6;

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  useEffect(() => {
    let isMounted = true;
    let list = [];
    const fetchData1 = async () => {
      if (searchKey) {
        if (searchKey === "NearBy") {
          if (isMounted && !navigator.geolocation) {
            setStatus("Geolocation is not supported by your browser");
          } else {
            navigator.geolocation.getCurrentPosition(function (position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              let radius = 0.1;
              let searchedList = [];
              while (
                searchedList.length < MAX_NEARBY_COUNTS &&
                radius < NEARBY_RADIUS
              ) {
                const list = allItems.filter(
                  // eslint-disable-next-line no-loop-func
                  (e) =>
                    Math.abs(e.longitude - longitude) < radius &&
                    Math.abs(e.latitude - latitude) < radius
                );
                if (list.length > 0) {
                  searchedList = list;
                }
                radius += 0.3;
              }
              if (searchedList.length === 0) {
                setStatus("No nearby items");
              } else {
                list = searchedList.slice(0, MAX_NEARBY_COUNTS);
              }
            });
          }
        } else if (searchKey === "Featured") {
          list = allItems.filter((item) => item.item_review_count > 0);
        } else {
          const data = await APIHandler.searchItem(searchKey);
          if (data && data.length > 0) {
            data.forEach((e) => {
              var item = allItems.find((d) => d.id === e.id);
              if (item) {
                list.push(item);
              }
            });
          }
        }
      }
      if (searchTag) {
        const listToSearch = searchKey ? list : allItems;
        list = [];
        const data1 = await APIHandler.searchItem(searchTag);
        if (data1 && data1.length > 0) {
          data1.forEach((e) => {
            var item = listToSearch.find((d) => d.id === e.id);
            if (item) {
              list.push(item);
            }
          });
        }
      }
      if (!searchKey && !searchTag) {
        list = allItems;
      }
      
      const data3 = await APIHandler.filterByDate(beginDate, endDate);
      let sorted = [];
      list.forEach((e) => {
        let item = data3.find((d) => d.item_id === e.id);
        if (item) {
          sorted.push(e);
        }
      });
      let newArray = [];
      newArray = sorted.filter(function (elem, pos) {
        return sorted.indexOf(elem) === pos;
      });
      if (isMounted) {
        setItems(newArray);
        setHasMore(true);
        setRenderCount(newArray.length < RENDER_COUNT ? newArray.length : RENDER_COUNT);
      }
    };
    fetchData1();
    return () => { isMounted = false; };
  }, [allItems, searchKey, searchTag, beginDate, endDate]);

  useEffect(() => {
    if (search) {
      setSearchKey(search);
    }
  }, [search]);

  useEffect(() => {
    let isMounted = true;
    APIHandler.getCategoryPrice().then(data => {
      if (isMounted && data.length > 0) {
        setCategories(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (tag) {
      setSearchTag(tag);
    }
  }, [tag]);

  useEffect(() => {
    onSearchItems(items);
  }, [items, onSearchItems]);

  const fetchData = () => {
    if (renderCount >= items.length) {
      setHasMore(false);
    } else {
      setRenderCount(renderCount + RENDER_COUNT);
    }
  };

  const isFeatured = (id) => {
    return wishItems.length > 0 && wishItems.find((e) => +e.item_id === id);
  };

  const onSearch = (e) => {
    setSearchKey(e.target.value);
  };

  const handleDatetimeRangeChange = (range) => {
    setBeginDate(range.start);
    setEndDate(range.end);
  }

  return (
    <div className={props.className}>
      <div className="form-group position-relative ms-2 me-3 my-2">
        <input
          type="text"
          id="searchkey"
          placeholder="Search"
          className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${styles.searchInput}`}
          value={searchKey}
          onChange={onSearch}
        />
        <BsSearch className={styles.searchIcon} />
      </div>
      <div className="form-group position-relative ms-2 me-3 my-2">
        <select
          className={`form-select ${styles.category}`}
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          id="search-category"
        >
          <option value="">All</option>
          {categories.map((item) => (
            <option key={`category-${item.id}`} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group position-relative ms-2 me-3 my-2">
        <DatetimeRangePicker
          className="d-flex"
          startDate={beginDate}
          endDate={endDate}
          dateFormat="MM-DD-YYYY"
          // utc="true"
          onChange={handleDatetimeRangeChange}
        />
      </div>
      {items.length > 0 ? (
        <div
          id="listScroll"
          className="list-scrollbar position-relative search-list-height px-3"
        >
          <InfiniteScroll
            dataLength={renderCount}
            next={fetchData}
            hasMore={hasMore}
            loader={<AppSpinner absolute />}
            scrollableTarget="listScroll"
            className="row g-3"
          >
            {items.slice(0, renderCount).map((data) => (
              <ItemSearchCard
                key={`item-${data.id}`}
                itemId={data.id}
                itemImg={getDefaultImageUri(allItemImages, data.id, 200)}
                itemName={data.name}
                ownerId={data.user_id}
                ownerImg={getUserAvatar(data.user_img)}
                ownerName={data.user_name}
                verified={data.user_verify === "1"}
                rate={+data.item_review_rating_avg}
                review={data.item_review_count}
                location={getLocation(data)}
                showHeart={true}
                featured={isFeatured(data.id)}
              />
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="fw-400 fs-1p0 gray-36 text-center mt-4">{status}</div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    allItems: state.allItems,
    allItemImages: state.allItemImages,
    wishItems: state.wishItems,
  };
};

export default connect(mapStateToProps, { getAllItems })(SearchListSection);
