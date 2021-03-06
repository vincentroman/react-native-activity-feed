// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { humanizeTimestamp } from '../utils';
import Avatar from './Avatar';
import { buildStylesheet } from '../styles';

import type { Comment, StyleSheetLike } from '../types';

type Props = {
  comment: Comment,
  styles?: StyleSheetLike,
};

/**
 * Renders a comment
 * @example ./examples/CommentItem.md
 */
export default class CommentItem extends React.Component<Props> {
  render() {
    let { comment } = this.props;
    let styles = buildStylesheet('commentItem', this.props.styles || {});
    return (
      <View style={styles.container}>
        <Avatar source={comment.user.data.profileImage} size={25} noShadow />
        <View style={styles.commentText}>
          <Text>
            <Text style={styles.commentAuthor}>{comment.user.data.name} </Text>
            <Text style={styles.commentContent}>{comment.data.text} </Text>
            <Text style={styles.commentTime}>
              {humanizeTimestamp(comment.created_at)}
            </Text>
          </Text>
        </View>
      </View>
    );
  }
}
