import React, { Component, useState, useEffect } from "react";
import MessagePost from "./MessagePost";
import PostMessageModal from "../Modals/PostMessageModal";
import "./MessageBoard.css";
import "../../App.css";
import ClipLoader from "react-spinners/ClipLoader";
import { isAdminUser } from "../../utils/AdminReportingRoles";
import Pagination from "./Pagination";


const ContentAfterLoad = ({ messages, isLoading, removeMessage, userObj }) => {
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
    this.state = {
      showModal: "",
      messageText: "",
      postsPerPage: 20,
      currentPage: 1,
      indexOfFirstPost: 0,
      indexOfLastPost: 19,
       };
  }

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
      this.props.appendMessage(this.state.messageText);
      this.setState({ messageText: "" });
    }
  };

  handleFieldInput = (event) => {
    var stateObj = {};
    stateObj[event.target.id] = event.target.value;
    this.setState(stateObj);
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