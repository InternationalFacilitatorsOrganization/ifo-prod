import * as React from "react";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import handshakeImg from "../assets/ifo-experience/IMG_4158.jpg";
import Img4145 from "../assets/ifo-experience/IMG_4145.jpg";
import Img9609 from "../assets/ifo-experience/IMG_9609.jpg";
import Img9608 from "../assets/ifo-experience/IMG_9608.jpg";
import CigarBarImg from "../assets/ifo-experience/CigarBar.jpg";
import MoAngelaImg from "../assets/ifo-experience/MoAngela.jpg";
import CigarBar2Img from "../assets/ifo-experience/CigarBar2.jpg";
import Img3140 from "../assets/ifo-experience/IMG_3140.jpg";


const photos = [
  { src: handshakeImg.src, width: 1285, height: 1714, alt: 'Two men shaking hands indoors' },
  { src: Img4145.src, width: 1210, height: 907, alt: 'A selfie of a group of smiling men and women outdoors' },
  { src: Img9609.src, width: 1285, height: 1714, alt: 'A group of smiling men and women posing on indoors stairs' },  
  { src: Img9608.src, width: 1714, height: 1285, alt: 'A group of nine smiling people posing in a hotel conference room' },
  { src: CigarBarImg.src, width: 1200, height: 1600, alt: 'A group of five smiling people posing for a photo inside a bar' },
  { src: MoAngelaImg.src, width: 1600, height: 1200, alt: 'A man and a woman smiling indoors' },
  { src: CigarBar2Img.src, width: 1600, height: 1200, alt: 'A group of four people smiling for a photo in front of a brick wall with art on display' },
  { src: Img3140.src, width: 1210, height: 907, alt: 'A group of nine smiling people posing for a photo in a hotel conference room' },
];


export default function Gallery() {
  const [index, setIndex] = React.useState(-1);

  return (
    <>

      <MasonryPhotoAlbum
        photos={photos}
        // targetRowHeight={150}
        onClick={({ index: current }) => setIndex(current)}
      />

      <Lightbox
        index={index}
        slides={photos}
        open={index >= 0}
        close={() => setIndex(-1)}
        styles={{ container: { backgroundColor: "rgba(250,250,250, 1.0)" } }}
      />
    </>
  );
}
