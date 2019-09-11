import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Container } from 'src/ui/structure'
import { Colors, Spacing, Typography } from 'src/styles'
import { largeText } from '../../../../styles/typography'
import { ShardEntity } from '../../../../lib/storage/entities/shardEntity'

interface Props {
  shards: ShardEntity[]
  toggleModal: (shardId: number) => void
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: Colors.blackMain,
    padding: '5%',
  },
  header: {
    ...largeText,
    marginTop: Spacing.XXL,
  },
  note: {
    ...Typography.noteText,
    ...Typography.centeredText,
    margin: 20,
  },
  phraseSection: {
    flex: 1,
  },
  seedPhrase: {
    ...Typography.largeText,
    ...Typography.centeredText,
  },
  buttonSection: {
    marginTop: 'auto',
  },
})

export const ReceivedShardsComponent: React.FunctionComponent<Props> = ({
  shards,
  toggleModal,
}) => (
  <Container style={styles.container}>
    <Text style={styles.header}>Received Shards</Text>
    <Text style={styles.note}>
      Share this parts with friends in case they need to recovery their
      identity. Make sure to share these parts only with them.
    </Text>
    {shards.length !== 0 ? (
      shards.map((shard, i) => (
        <TouchableHighlight
          key={i}
          style={{ width: '100%' }}
          onPress={() => toggleModal(i)}
        >
          <React.Fragment>
            <View
              style={{ width: '100%', height: 1, backgroundColor: 'white' }}
            />
            <Text
              style={[styles.note, { margin: 20 }]}
            >{`Recovery part of ${shard.label} - Tap to share`}</Text>
          </React.Fragment>
        </TouchableHighlight>
      ))
    ) : (
      <Text style={[styles.note, { fontSize: 25 }]}>
        No received shards yet.
      </Text>
    )}
  </Container>
)
