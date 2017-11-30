import React, { Component } from 'react'
import axios from 'axios';
import fire from './config/fire'
import { Tweet } from 'react-twitter-widgets'

import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      url: 'http://localhost:3001',
      isAuthenticated: false,
      userId: '',
      token: '',
      showLoginModal: false,
      showSignupModal: false,
      showTopicsModal: false,
      newTopic: '',
      signupEmail: '',
      signupPassword: '',
      signupErrorMessage: '',
      loginEmail: '',
      loginPassword: '',
      loginErrorMessage: '',
      topics: [],
      tweets: []
    }
  }
  componentWillMount() {
    let self = this

    fire.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.setState({ isAuthenticated: true, userId: user.uid })

        // fetch saved topics when user is logged in
        let topicsRef = fire.database().ref('users/' + user.uid + '/topics');
        topicsRef.on('value', function(snapshot) {
          if (snapshot.val()) {
            let topics = snapshot.val()
            self.setState({ topics: topics })
            self.loadTweets(topics[0])
          } else {
            self.setState({ topics: [] })
          }
        })
      } else {
        // set default topics when user is logged out
        let topics = ['dji', 'leanplum', 'livongo', 'mesosphere', 'n3twork', 'progyny', 'truecaller', 'trusona']
        self.setState({ isAuthenticated: false, topics: topics })
        self.loadTweets(topics[0])
      }
    })
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  loadTweets(query) {
    axios.get(this.state.url + '/api/search_tweets/' + query)
      .then(res => {
        this.setState({ tweets: res.data.data.statuses})
      })
      .catch(err => {
        console.log(err)
      })
  }
  addTopic() {
    let self = this
    let topics = this.state.topics
    topics.push(this.state.newTopic)
    fire.database().ref('users/' + self.state.userId).set({
      topics: topics
    })
    .then(function() {
      self.setState({ newTopic: '', showTopicsModal: false })
    })
  }
  signup() {
    let email = this.state.signupEmail
    let password = this.state.signupPassword
    let self = this

    fire.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
      self.setState({ showSignupModal: false })
      fire.auth().signInWithEmailAndPassword(email, password)
    })
    .catch(function(error) {
      self.setState({ signupErrorMessage: error.message })
    })
  }
  login() {
    let email = this.state.loginEmail
    let password = this.state.loginPassword
    let self = this

    fire.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
      self.setState({ showLoginModal: false })
    })
    .catch(function(error) {
      self.setState({ loginErrorMessage: error.message })
    })
  }
  logout() {
    fire.auth().signOut()
  }
  render() {
    console.log(this.state.tweets)

    let tweetsHtml = []
    for (let i = 0; i < this.state.tweets.length; i++) {
      let tweet = this.state.tweets[i]
      tweetsHtml.push(
        <div className="tweet" key={'tweet' + i}>
          <Tweet
            tweetId={tweet.id_str}
          />
        </div>
      )
    }

    let titleLinksHtml = []
    if (this.state.topics.length == 0) {
      titleLinksHtml.push("Add a topic to see some links here!")
    } else {
      for (let i = 0; i < this.state.topics.length; i++) {
        let topic = this.state.topics[i]
        titleLinksHtml.push(
          <div className="title-link" key={topic} onClick={() => this.loadTweets(topic)}>{topic}</div>
        )
      }
    }

    return (
      <div>
        { this.state.showSignupModal ? 
          <div className="modal">
            <div className="modal-top">
              Signup
              <div className="modal-close" onClick={() => this.setState({ showSignupModal: false })}>&times;</div>
            </div>
            <div className="modal-description">
              Create an account to be able to save custom Twitter searches!
            </div>
            <div className="modal-error">{this.state.signupErrorMessage}</div>
            <table>
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>
                    <input
                      id="signup-email" 
                      type="text" 
                      name="signupEmail" 
                      value={this.state.signupEmail} 
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>
                    <input 
                      id="signup-password" 
                      type="password" 
                      name="signupPassword" 
                      value={this.state.signupPassword}
                      onChange={(e) => this.handleChange(e)}
                    />
                    </td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => this.signup()}>Sign Up</button>
          </div>
          :
          null
        }
        { this.state.showLoginModal ?
          <div className="modal">
            <div className="modal-top">
              Login
              <div className="modal-close" onClick={() => this.setState({ showLoginModal: false })}>&times;</div>
            </div>
            <div className="modal-description">
              Login to your Bulletin account!
            </div>
            <div className="modal-error">{this.state.loginErrorMessage}</div>
            <table>
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>
                    <input 
                      id="login-email" 
                      type="text" 
                      name="loginEmail" 
                      value={this.state.loginEmail} 
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>
                    <input 
                      id="login-password" 
                      type="password" 
                      name="loginPassword" 
                      value={this.state.loginPassword} 
                      onChange={(e) => this.handleChange(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => this.login()}>Login</button>
          </div>
          :
          null
        }
        { this.state.showTopicsModal ? 
          <div className="modal">
            <div className="modal-top">
              Add a Topic
              <div className="modal-close" onClick={() => this.setState({ showTopicsModal: false })}>&times;</div>
            </div>
            <div className="modal-description">
              Add a topic to see it in Bulletin.
            </div>
            <br />
            <input
              type="text" 
              name="newTopic" 
              value={this.state.newTopic} 
              onChange={(e) => this.handleChange(e)}
            />
            <button onClick={() => this.addTopic()}>Save</button>
          </div>
          :
          null
        }
        <div className="title">
          Bulletin
          { this.state.isAuthenticated ? 
            <div className="title-buttons" id="title-buttons-logged-in">
              <div className="title-button" id="topics-toggle" onClick={() => this.setState({ showTopicsModal: true })}>
                Add a Topic
              </div>
              <div className="title-button" id="logout" onClick={() => this.logout()}>
                Logout
              </div>
            </div>
          :
            <div className="title-buttons" id="title-buttons-logged-out">
              <div className="title-button" id="login-toggle" onClick={() => this.setState({ showLoginModal: true })}>
                Login
              </div>
              <div className="title-button" id="signup-toggle" onClick={() => this.setState({ showSignupModal: true })}>
                Signup
              </div>
            </div>
          }
          <div className="title-links">
            {titleLinksHtml}
          </div>
        </div>
        <div className="container">
          {tweetsHtml}
        </div>
      </div>
    )
  }
}

export default App
