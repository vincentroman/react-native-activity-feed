// @flow
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { UserBar } from 'react-native-activity-feed';
import ReactionCounterBar from './ReactionCounterBar';
import ReactionCounter from './ReactionCounter';
import CommentList from './CommentList';
import Card from './Card';
import type { ActivityData, UserResponse, NavigationProps } from '../types';

// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIcon from '../images/icons/heart.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import HeartIconOutline from '../images/icons/heart-outline.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import RepostIcon from '../images/icons/repost.png';
// $FlowFixMe https://github.com/facebook/flow/issues/345
import ReplyIcon from '../images/icons/reply.png';

type Props = {
  activity: ActivityData,
  style?: any,
  onToggleReaction?: (kind: string, activity: ActivityData) => mixed,
} & NavigationProps;

export default class Activity extends React.Component<Props> {
  _onPress = () => {
    this.props.navigation.navigate('SinglePost', { item: this.props.activity });
  };

  _onPressAvatar = () => {
    if (this.props.activity.actor !== 'NotFound') {
      return;
    }
    // TODO: go to profile
  };

  _onPressHeart = () => {
    if (this.props.onToggleReaction) {
      this.props.onToggleReaction('heart', this.props.activity);
    }
  };

  render() {
    const { width } = Dimensions.get('window');
    let icon, sub;
    let {
      time,
      actor,
      verb,
      object,
      content,
      image,
      reaction_counts,
      own_reactions,
      latest_reactions,
    } = this.props.activity;

    let notFound: UserResponse = {
      id: '!not-found',
      created_at: '',
      updated_at: '',
      data: {
        name: 'Unknown',
      },
    };

    if (actor === 'NotFound') {
      actor = notFound;
    }

    if (verb === 'heart') {
      icon = HeartIcon;
    }
    if (verb === 'repost') {
      icon = RepostIcon;
    }
    if (verb === 'comment') {
      icon = ReplyIcon;
      // TODO: This is wrong. Should take name from object.
      sub = `reply to ${actor.data.name || 'Unknown'}`;
    }

    return (
      <TouchableOpacity
        style={[{ ...this.props.style }, styles.container]}
        onPress={this._onPress}
      >
        <View style={{ padding: 15 }}>
          <UserBar
            onPressAvatar={this._onPressAvatar}
            data={{
              username: actor.data.name,
              image: actor.data.profileImage,
              subtitle: sub,
              timestamp: time,
              icon: icon,
            }}
          />
        </View>
        <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
          <Text>{content}</Text>
        </View>

        {verb == 'repost' &&
          object instanceof Object && (
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <Card item={object.data} />
            </View>
          )}

        {image && (
          <Image
            style={{ width: width, height: width }}
            source={{ uri: image }}
          />
        )}

        {reaction_counts && (
          <View
            style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}
          >
            <ReactionCounterBar>
              <ReactionCounter
                value={reaction_counts.repost || 0}
                icon={{ source: RepostIcon, width: 24, height: 24 }}
              />
              <ReactionCounter
                value={reaction_counts.heart || 0}
                icon={
                  own_reactions &&
                  own_reactions.heart &&
                  own_reactions.heart.length
                    ? { source: HeartIcon, width: 24, height: 24 }
                    : { source: HeartIconOutline, width: 24, height: 24 }
                }
                onPress={() => this._onPressHeart()}
              />
              <ReactionCounter
                value={reaction_counts.comment || 0}
                icon={{ source: ReplyIcon, width: 24, height: 24 }}
              />
            </ReactionCounterBar>
          </View>
        )}
        <CommentList reactions={latest_reactions} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomWidth: 1,
  },
});