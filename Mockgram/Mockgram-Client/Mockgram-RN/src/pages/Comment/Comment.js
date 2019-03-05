import React from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { SkypeIndicator, BallIndicator } from 'react-native-indicators';

import CommentDetail from './CommentDetail';
import CommentListCell from '../../components/CommentListCell';
import TextInputBox from '../../components/TextInputBox';
import DismissKeyboard from '../../components/DismissKeyboard';
import Header from '../../components/Header';

import config from '../../common/config';
import baseUrl from '../../common/baseUrl';
import { parseIdFromObjectArray } from '../../utils/idParser';
import window from '../../utils/getDeviceInfo';

class CommentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            postId: this.props.navigation.getParam('postId', null),
            creatorId: this.props.navigation.getParam('creatorId', null),
            refreshing: false,
            loadidng: false,
            loadingMore: false,
            hasMore: true,
            fetching: false,
            interrupt: false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true,
            data: []
        }, () => {
            this.fetchComment();
        });
    }

    fetchComment = () => {
        const url = `${baseUrl.api}/post/comment`;
        this.setState({
            fetching: true
        }, () => {
            console.log(`feching data from ${url}`);
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lastQueryDataIds: this.state.refreshing ? [] : parseIdFromObjectArray(this.state.data),
                    postId: this.state.postId,
                    creatorId: this.state.creatorId,
                    limit: config.commentReturnLimit
                })
            }).then(res => res.json()).then(res => {
                if (this.state.interrupt) {
                    this.setState({
                        interrupt: false
                    })
                } else {
                    this.setState({
                        data: this.state.loadingMore === true ? [...this.state.data, ...res.data] : res.data,
                        error: res.status === 200 ? null : res.msg,
                        hasMore: res.data.length < config.commentReturnLimit ? false : true,
                    });
                }
            }).then(() => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadingMore: false,
                    fetching: false
                })
            }).catch(error => {
                this.setState({
                    error: error,
                    loading: false,
                    refreshing: false,
                    loadingMore: false
                });
            });
        })
    };

    handleRefresh = () => {
        if (!this.state.refreshing && !this.state.loading) {
            if (this.state.fetching) {
                this.setState({
                    interrupt: true
                })
            }
            this.setState({
                refreshing: true
            }, () => {
                console.log("refreshing");
                this.fetchComment();
            })
        }
    };

    handleLoadMore = () => {
        if (this.state.hasMore && !this.state.refreshing && !this.state.loadingMore && !this.state.loading) {
            this.setState(
                {
                    loadingMore: true
                },
                () => {
                    console.log("loading more");
                    this.fetchComment();
                }
            );
        }
    };

    renderFooter = () => {
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? <BallIndicator size={20} /> : <Text style={{ color: 'grey', fontSize: 12 }}>- No more comments -</Text>}
            </View>
        );
    };


    renderComment = () => {
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><SkypeIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (
                <FlatList
                    style={{ marginTop: 0, width: '100%', flex: 1 }}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <CommentListCell
                            dataSource={item}
                            navigation={this.props.navigation}
                            creatorId={this.state.creatorId}
                        />
                    )}
                    keyExtractor={item => item._id}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    ListFooterComponent={this.renderFooter}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
            );
        }
    }


    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="All Comments"
                    rightIconButton={
                        <Icon name="md-close" style={{ fontSize: 24 }} />
                    }
                    rightButtonOnPress={() => {
                        navigation.dismiss();
                    }}
                />
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
                    <DismissKeyboard>
                        <View style={styles.contentContainer}>
                            {this.renderComment()}
                        </View>
                    </DismissKeyboard>
                    <TextInputBox />
                </KeyboardAvoidingView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: window.width,
        height: window.height,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginTop: 0,
        width: '100%'
    },
    listFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    errorMsgView: {
        height: window.height * 0.85,
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default CommentNavigator = createStackNavigator({
    CommentPage: CommentPage,
    CommentDetail: CommentDetail
}, {
        headerMode: 'none'
    })
