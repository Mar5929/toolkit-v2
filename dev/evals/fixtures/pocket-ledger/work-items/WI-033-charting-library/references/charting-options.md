# Charting options for Pocket Ledger

| Option | iOS versions | Effort to use | How the chart looks |
|---|---|---|---|
| Swift Charts (built into iOS) | iOS 16 and newer | Low: a few lines per chart | Matches the rest of the system look |
| An open-source charting library | Older iOS versions too | Medium: add it and learn its settings | Many styles, some look dated |
| Drawing the chart ourselves | Any iOS version | High: every bar, label, and tap is ours to build | Exactly what we design |

## Recommendation

Use Swift Charts. The beta users are on iOS 17 and newer (Q-02), it is built in so nothing extra is installed, and it takes the least work.
