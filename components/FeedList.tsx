import { useFeedListQuery } from '@/hooks/useFeedListQuery'
import type { FeedPost } from '@/types'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import FeedCard from './FeedCard'

const isInfiniteData = (data: unknown): data is { pages: FeedPost[][] } => {
  return !!(data && typeof data === 'object' && 'pages' in data)
}

export default function FeedList() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useFeedListQuery({ mode: 'infinite' })

  const posts = isInfiniteData(data) ? data.pages.flat() : ((data as FeedPost[]) ?? [])

  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>피드를 불러오지 못했습니다.</Text>
      </View>
    )
  }

  if (!isLoading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>피드가 없습니다.</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <FeedCard feed={item} />}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.contentContainer}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    gap: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: 16,
  },
})
