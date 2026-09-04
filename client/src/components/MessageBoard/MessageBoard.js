import React, { Component, useState, useEffect } from "react";
import MessagePost from "./MessagePost";
import PostMessageModal from "../Modals/PostMessageModal";
import "./MessageBoard.css";
import "../../App.css";
import ClipLoader from "react-spinners/ClipLoader";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import Pagination from "./Pagination";


const ContentAfterLoad = ({
  messages,
  isLoading,
  removeMessage,
  userObj,
  lastViewedBefore,
}) => {
  const [currentMessages, setCurrentMessage] = useState(messages);

  const doRemoveMessage = async (id) => {
    const messages = await removeMessage(id);
    setCurrentMessage(messages);
  };

  useEffect(() => {
    setCurrentMessage(messages);
  }, [messages]);

  return currentMessages.length === 0 ? (
    <p className="text-center mt-5">
      {!isLoading &&
        "Looks like there aren't any discussion posts at the moment"}
    </p>
  ) : (
    <div id="messageBoard">
      {currentMessages.map((item, index) => (
        <MessagePost
          userObj={userObj}
          messageObj={item}
          doRemoveMessage={doRemoveMessage}
          lastViewedBefore={lastViewedBefore}
        >
          {item.message}
        </MessagePost>
      ))}

    </div>
  );
};

class MessageBoard extends Component {
  constructor(props) {
    super(props);
    // messages posted after this timestamp are "new" - captured once, before
    // componentDidMount marks the board as viewed as of now
    this.lastViewedBefore = this.getLastViewedTimestamp();
    this.state = {
      showModal: "",
      messageText: "",
      messageImage: "",
      postsPerPage: 20,
      currentPage: 1,
      indexOfFirstPost: 0,
      indexOfLastPost: 19,
       };
  }

  componentDidMount() {
    this.markMessageBoardViewed();
  }

  getLastViewedStorageKey = () => {
    const { userObj } = this.props;
    return `messageBoardLastViewed:${userObj?.homeId}:${userObj?.email}`;
  };

  getLastViewedTimestamp = () => {
    try {
      return localStorage.getItem(this.getLastViewedStorageKey());
    } catch (e) {
      return null;
    }
  };

  markMessageBoardViewed = () => {
    try {
      localStorage.setItem(
        this.getLastViewedStorageKey(),
        new Date().toISOString()
      );
    } catch (e) {
      // ignore storage errors (e.g. private browsing)
    }
  };

  handlePagination = (pageNumber) => {
    this.state.currentPage = pageNumber;
    this.props.loadMessage(this.props.userObj, pageNumber)
    let firstIndex = (((this.props.currentPage) - 1) * 20);
    // this.setState({currentPage: pageNumber});
    this.setState({indexOfFirstPost: firstIndex})
    this.setState({indexOfLastPost: (this.props.currentPage*20) - 1 })
  };

  recentPageMessage = () => {
    this.state.currentPage = 1;
    this.props.loadMessage(this.props.userObj, this.state.currentPage)
  }

  nextPageMessage = () => {
    this.state.currentPage += 1;
    this.props.loadMessage(this.props.userObj, this.state.currentPage)
  }

  prevPageMessage = () => {
    this.state.currentPage -= 1;
    this.props.loadMessage(this.props.userObj, this.state.currentPage)
  }

  openModal = (modalName) => {
    this.setState({ showModal: modalName });
  };

  closeModals = () => {
    this.setState({ showModal: "" });
  };

  callAppendMessage = () => {
    if (
      this.state.messageText.length > 0 &&
      /^\s+/.test(this.state.messageText) === false
    ) {
      this.props.appendMessage(this.state.messageText, this.state.messageImage);
      this.setState({ messageText: "", messageImage: "" });
    }
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
  };

  handleMessageImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const ALLOWED_IMAGE_TYPES = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
    ];
    const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB, mirrors routes/api/discussionMessages.js

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Please choose a PNG, JPEG, GIF, or WEBP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      alert(
        `Image is too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB).`
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ messageImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  clearMessageImage = () => {
    this.setState({ messageImage: "" });
    const input = document.getElementById("messageImageUpload");
    if (input) input.value = "";
  };

  render() {
    return (
      <div style={{ marginTop: "60px" }}>
        <div className="messageBoardTitleDiv">
          <div
            style={{
              width: "100%",
              display: "flex",
              margin: "10px 0px",
              justifyContent: "center",
            }}
          >
            {isAdminUser(this.props.userObj) ? (
              <>
                <textarea
                  id="messageText"
                  value={this.state.messageText}
                  onChange={this.handleFieldInput}
                  cols="1"
                  style={{
                    height: "100px",
                    width: "100%",
                    flex: "1",
                    borderColor: "#ccc",
                    margin: "0px 5px",
                    resize: "none",
                    borderWidth: ".5px",
                    borderRadius: "9px",
                    padding: "12px 20px",
                    boxSizing: "border-box",
                    border: "2px solid #ccc",
                  }}
                  placeholder="Let everyone know what's going on or simply say hello! Information here will be display for all users to see."
                ></textarea>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("messageImageUpload").click()
                  }
                  className="btn btn-light"
                  style={{ margin: "0px 5px", width: "75px" }}
                  title="Attach a photo"
                >
                  <i className="fa fa-camera"></i>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id="messageImageUpload"
                  onChange={this.handleMessageImageUpload}
                  style={{ display: "none" }}
                />
                <button
                  onClick={this.callAppendMessage}
                  className="btn btn-light"
                  style={{ margin: "0px 5px", width: "75px" }}
                >
                  Post
                </button>
              </>
            ) : (
              <h2 className="formTitle text-center">Dashboard Announcements</h2>
            )}
          </div>
          {this.state.messageImage && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0px 0px 10px 0px",
              }}
            >
              <img
                src={this.state.messageImage}
                alt="Attachment preview"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  borderRadius: "9px",
                  border: "2px solid #ccc",
                }}
              />
              <button
                type="button"
                onClick={this.clearMessageImage}
                className="btn btn-link"
                style={{ padding: "2px" }}
              >
                Remove photo
              </button>
            </div>
          )}
        </div>
        {this.props.discussionMessagesLoading && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ClipLoader className="formSpinner" size={50} color={"#ffc107"} />
            </div>
          </>
        )}
        {/* hide pagination on load */}
        {!this.props.discussionMessagesLoading && 
        <Pagination
        length={this.props.messages.length}
        postsPerPage={this.state.postsPerPage}
        prevPageMessage = {this.prevPageMessage}
        nextPageMessage = {this.nextPageMessage}
        recentPageMessage = {this.recentPageMessage}
        currentPage={this.state.currentPage}
        loadMessage={this.props.loadMessage}
        userObj={this.props.userObj}
      />
        }
        
        <ContentAfterLoad
          removeMessage={this.props.removeMessage}
          messages={this.props.messages.slice(((this.props.currentPage-1)*this.state.postsPerPage), ((this.props.currentPage*this.state.postsPerPage)-1))}
          isLoading={this.props.discussionMessagesLoading}
          userObj={this.props.userObj}
          lastViewedBefore={this.lastViewedBefore}
        />
        <PostMessageModal
          appendMessage={this.props.appendMessage}
          closeModals={this.closeModals}
          doShow={this.state.showModal === "PostMessageModal"}
        />
      </div>
    );
  }
}

export default MessageBoard;