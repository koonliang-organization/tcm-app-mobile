import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Herb } from '@/data/herbs';

export type HerbCardProps = { herb: Herb; onPress?: (herb: Herb) => void };

export const HerbCard = React.memo(({ herb, onPress }: HerbCardProps) => {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(herb)}
      accessibilityRole="button"
      accessibilityLabel={`Herb ${herb.nameZh}`}
    >
      <Image source={require('../../../../assets/herbs.jpg')} style={styles.image} />
      <View style={styles.meta}>
        <Text style={styles.title}>{herb.nameZh}</Text>
        <Text style={styles.subtitle}>{herb.namePinyin}</Text>

        {!!herb.family && <Text style={styles.caption}>{herb.family}</Text>}

        {(herb.property || (herb.flavor && herb.flavor.length)) && (
          <View style={styles.tagsRow}>
            {!!herb.property && <View style={styles.tag}><Text style={styles.tagText}>{herb.property}</Text></View>}
            {(herb.flavor || []).map((f, idx) => (
              <View key={`flavor-${idx}`} style={styles.tag}><Text style={styles.tagText}>{f}</Text></View>
            ))}
          </View>
        )}

        {!!(herb.meridians && herb.meridians.length) && (
          <Text style={styles.bodyText}>Meridians: {herb.meridians.join(', ')}</Text>
        )}

        {!!(herb.indications && herb.indications.length) && (
          <Text style={styles.bodyText}>Indications: {herb.indications.join(' • ')}</Text>
        )}

        {!!herb.sourceUrl && (
          <Pressable
            onPress={() => Linking.openURL(herb.sourceUrl!)}
            accessibilityRole="link"
            accessibilityLabel={`Open source for ${herb.nameZh}`}
            style={{ marginTop: 6 }}
          >
            <Text style={styles.link}>Source</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f1f1f1' },
  meta: { marginLeft: 12, flex: 1, minHeight: 64, justifyContent: 'flex-start' },
  title: { fontSize: 16, fontWeight: '600', color: '#111' },
  subtitle: { marginTop: 2, fontSize: 13, color: '#555' },
  caption: { marginTop: 4, fontSize: 12, color: '#777' },
  bodyText: { marginTop: 6, fontSize: 12.5, color: '#333' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { backgroundColor: '#F2F4F7', borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8 },
  tagText: { fontSize: 12, color: '#333' },
  link: { color: '#0a7ea4', fontSize: 12.5, textDecorationLine: 'underline', fontWeight: '600' },
});
