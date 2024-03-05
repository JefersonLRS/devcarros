import { Swiper, SwiperSlide } from "swiper/react";
import ad1 from "../../assets/adImages/ad1.png";
import ad2 from "../../assets/adImages/ad2.png";
import ad3 from "../../assets/adImages/ad3.png";
import ad4 from "../../assets/adImages/ad4.png";

export function AdImages() {
  let adList = [ad1, ad2, ad3, ad4];

  return (
    <div className="w-full mb-6">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: false,
        }}
        navigation={false}
      >
        {adList.map((ad, index) => (
          <SwiperSlide key={index}>
            <img src={ad} alt="ad" className="w-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
