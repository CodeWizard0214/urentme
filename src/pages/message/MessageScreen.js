import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { AiOutlineMessage } from 'react-icons/ai';

import { getUserMessages } from '../../store/actions/messageActions';
import ChatItem from '../../components/message/ChatItem';
import MessageBox from '../../components/message/MessageBox';
import MessageInput from './MessageInput';
import ItemToastr from './ItemToastr';
import AppSpinner from '../../components/loading/AppSpinner';
import CircleMark from '../../components/marks/CircleMark';
import SearchBox from '../../components/elements/SearchBox';
import { getUserAvatar } from '../../utils/imageUrl';
import { containPhoneNumbers } from '../../utils/stringUtils';
import * as Constant from '../../constants/constant';
import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import CollapseButton from '../../components/elements/CollapseButton';
import styles from './MessageScreen.module.css';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const MessageScreen = (props) => {
  const { userId, userInfo, userMessages, getUserMessages } = props;
  const [chatList, setChatList] = useState([]);
  const [chatData, setChatData] = useState({});
  const [messages, setMessages] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [snippet, setSnippet] = useState('');
  const [chatRenderCount, setChatRenderCount] = useState(0);
  const [chatHasMore, setChatHasMore] = useState(true);
  const [msgRenderCount, setMsgRenderCount] = useState(0);
  const [msgHasMore, setMsgHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [displayCollapse, setDisplayCollapse] = useState(false);
  const [itemData, setItemData] = useState({});
  const CHAT_RENDER_COUNT = 10;
  const MSG_RENDER_COUNT = 12;

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId || !isMounted) {
        return;
      }

      if (userMessages.length === 0) {
        setLoading(false);
        return;
      }

      const msgs = userMessages;
      msgs.sort((a, b) => moment(b.timestamp) - moment(a.timestamp));
      const send_ids = Array.from(msgs, ({ send_id }) => send_id);
      const unique_sends = [...new Set(send_ids)].filter(
        (e) => e !== +userId
      );
      const get_ids = Array.from(msgs, ({ get_id }) => get_id);
      const unique_gets = [...new Set(get_ids)].filter(
        (e) => e !== +userId
      );
      const unique_ids = [...new Set([...unique_sends, ...unique_gets])];

      let sessions = [];
      for (const id of unique_ids) {
        const history = msgs.filter((e) => e.send_id === id || e.get_id === id);
        const data = await APIHandler.getUserInfo(id);
        const username = data?.username ?? "removed user";
        const lastTime = moment.utc(history[0].timestamp).local();
        const diff = moment.utc().diff(lastTime, "days");
        const dateString =
          diff < 1 ? lastTime.format("hh:00 A") : `${diff}d ago`;
        sessions.push({
          id: id,
          avatar: getUserAvatar(data?.img),
          alt: username,
          title: username,
          subtitle: history[0].message,
          dateString: dateString,
          lastTime: lastTime,
          history: history,
          vehicleId: history[0].vehicle_id
        });
      }
      sessions.sort((a, b) => b.lastTime - a.lastTime);
      setLoading(false);
      setChatList(sessions);
    };

    fetchData();
    sessionStorage.setItem(Constant.MSG_COUNT, userMessages.length); // reset msg notification
    return () => { isMounted = false; };
  }, [userMessages, userId]);

  useEffect(() => {
    const setSessionMessages = (session) => {
      let data = [];
      for (const msg of session.history) {
        data.push({
          avatar: session.avatar,
          name: session.title,
          position: +userId === msg.send_id ? "right" : "left",
          type: "text",
          text: msg.message,
          // date: moment(msg.timestamp).toDate(),
          timestamp: msg.timestamp,
          sent: true,
        });
      }
      setMessages(data);      
    }

    if (userId
        && chatList.length > 0) {
      if (Object.keys(chatData).length === 0) {
        setChatData(chatList[0]);
        setSessionMessages(chatList[0]);
      } else {
        const session = chatList.filter((e) => e.id === chatData.id);
        if (session.length !== 1) {
          return;
        }
        setChatData(session[0]);
        setSessionMessages(session[0]);
      }
    }
  }, [userId, chatList, chatData]);

  useEffect(() => {
    setChatRenderCount(
      chatList.length < CHAT_RENDER_COUNT
        ? chatList.length
        : CHAT_RENDER_COUNT
    );
  }, [chatList]);

  useEffect(() => {
    setMsgRenderCount(
      messages.length < MSG_RENDER_COUNT ? messages.length : MSG_RENDER_COUNT
    );
  }, [messages]);
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(windowDimensions.width < 768) {
      setDisplayCollapse(true);
    }
    else{
      setDisplayCollapse(false) ;
    }
  }, [windowDimensions.width, collapsed]);

  const getMessageData = (session, text, pos, timestamp, sent) => {
    return {
      avatar: session.avatar,
      name: session.title,
      position: pos,
      type: "text",
      text: text,
      timestamp: timestamp,
      sent: sent,
    };
  };

  const onChatDetails = (id) => {
    if (!id || !chatList.length) {
      return;
    }
    setCollapsed(true);
    setItemData({});
    const session = chatList.filter((e) => e.id === id);
    if (session.length !== 1) {
      return;
    }

    let data = [];
    for (const msg of session[0].history) {
      data.push(getMessageData(
        session[0],
        msg.message,
        +userId === msg.send_id ? "right" : "left",
        msg.timestamp,
        true,
      ));
    }

    setChatData(session[0]);
    setMessages(data);
    if (session[0].vehicleId) {
      APIHandler.getItemDetails(session[0].vehicleId).then(data => {
        if (data.length === 1) {
          setItemData(data[0]);
        }
      });
    } else {
      setItemData({});
    }
  };

  const fetchChatData = () => {
    if (chatRenderCount >= chatList.length) {
      setChatHasMore(false);
    } else {
      setChatRenderCount(chatRenderCount + CHAT_RENDER_COUNT);
    }
  };

  const fetchMsgData = () => {
    if (msgRenderCount >= messages.length) {
      setMsgHasMore(false);
    } else {
      setMsgRenderCount(msgRenderCount + MSG_RENDER_COUNT);
    }
  };

  const onSearch = (e) => {
    const key = e.target.value;
    setSearchKey(key);
  };

  const onMessageChange = (e) => {
    setSnippet(e.target.value);
  }

  const onMessageKeyPress = (e) => {
    if (e.key === 'Enter' && snippet) {
      onMessageSend();
    }
  }
  
  const onMessageSend = () => {
    if (containPhoneNumbers(snippet)) {
      toast.error('Any phone number can\'t be shared!');
      return;
    }

    const list = [getMessageData(
      chatData,
      snippet,
      "right",
      moment(new Date()).format(Constant.DATE_TIME_FORMAT),
      false,
    ), ...messages];
    setMessages(list);

    APIHandler.sendPushNotification(
      chatData.onesignal_id,
      'New Message',
      `${userInfo?.first_name} ${userInfo?.last_name} sent a new message`,
    );

    APIHandler.addMessage(chatData.id, userId, snippet, chatData.vehicleId).then(data => {
      if (data.result === 'True') {
        sessionStorage.setItem(Constant.MSG_COUNT, userMessages.length + 1);
        getUserMessages(userId);
      }
    });

    setSnippet('');
  }

  const emptyView = (
    <div className="d-flex flex-column align-items-center justify-content-center app-content-height mx-auto">
      <CircleMark
        width={110}
        height={110}
        borderColor={Color.PRIMARY_COLOR}
        borderWidth="2px"
        borderStyle="solid"
      >
        <AiOutlineMessage className="fs-3p0 color-primary mt-2" />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No Messages
      </span>
    </div>
  );

  return (
    <div className="container-fluid d-flex app-content-height">
      {loading ? (
        <AppSpinner absolute />
      ) : chatList.length > 0 ? (
      <>
        <div className={`${displayCollapse?(collapsed?"d-none":"w-100"):""} ${styles.userList} mt-4`}>
          <SearchBox
            placeholder="Search"
            className="mx-3 mb-2"
            onChange={onSearch}
          />

          <div id="chatScroll" className={`list-scrollbar position-relative ${styles.listHeight}`}>
            {chatList.length > 0 && (
              <InfiniteScroll
                dataLength={chatRenderCount}
                next={fetchChatData}
                hasMore={chatHasMore}
                loader={<AppSpinner absolute />}
                scrollableTarget="chatScroll"
              >
                {chatList.filter((session) => !searchKey || ([session.title, session.subtitle].some(x => x.toLowerCase().includes(searchKey.toLowerCase()))))
                  .slice(0, chatRenderCount)
                  .map((session, idx) => (
                  <ChatItem
                    key={`session-${session.id}`}
                    id={session.id}
                    active={session.id === chatData.id}
                    avatar={session.avatar}
                    title={session.title}
                    subtitle={session.subtitle}
                    dateString={session.dateString}
                    unread={session.unread}
                    onClick={onChatDetails}
                  />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
        <div className={`${displayCollapse?(collapsed?"":"d-none"):""} position-relative container max-w-1060px d-flex align-items-end`}>
          <div className='w-100'>
          <div
            id="msgScroll"
            className={`list-scrollbar d-flex flex-column-reverse gap-3 ${styles.listHeight}`}
          >
            {messages.length > 0 && (
              <InfiniteScroll
                dataLength={msgRenderCount}
                next={fetchMsgData}
                style={{ display: "flex", flexDirection: "column-reverse" }}
                inverse={true}
                hasMore={msgHasMore}
                loader={<AppSpinner />}
                scrollableTarget="msgScroll"
              >
                {messages.slice(0, msgRenderCount).map((msg, idx) => (
                  <div key={`msg-${idx}`} className="d-flex flex-column p-1">
                    <MessageBox
                      avatar={msg.avatar}
                      name={msg.name}
                      position={msg.position}
                      text={msg.text}
                      timestamp={msg.timestamp}
                      sent={msg.sent}
                    />
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </div>
          <MessageInput
            placeholder="Type a message here"
            className="mx-3 mt-2"
            value={snippet}
            onChange={onMessageChange}
            onKeyPress={onMessageKeyPress}
            onSend={onMessageSend}
          />
          </div>
          {displayCollapse && <CollapseButton
            className={styles.collapse}
            collapsed={!collapsed}
            onClick={toggleCollapse}
          />
          }
        </div>
        {Object.keys(itemData).length > 0 ? 
          <ItemToastr itemData={itemData} />
        :""
        }
      </>
      ) : (
        emptyView
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    userInfo: state.userInfo,
    userMessages: state.userMessages,
  };
};

export default connect(mapStateToProps, { getUserMessages })(MessageScreen);
