# Community photo captions

Captions live in `index.html` inside the Community section — each photo is a
`<figure class="community-photo">` with a `<figcaption>`. Edit the text there
(and the matching `alt` attribute) to change what displays under each photo.

Current placeholders:

| File | Caption |
|---|---|
| community-1.jpeg | Coffee meetup in Tokyo, JP |
| community-2.jpeg | Meetup in Brooklyn, NY |
| community-3.jpg | Meetup in Lisbon, PT |
| community-4.webp | Smashing Conf, Freiburg, GR |
| community-5.jpg | Workshop in San Francisco, CA |

To add a photo: drop the image in this folder, then copy one of the
`<figure>` blocks in `index.html` and update the `src`, `alt`, and caption.
The strip and scroll animation pick it up automatically.
