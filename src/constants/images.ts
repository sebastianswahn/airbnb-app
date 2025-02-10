export const IMAGES = {
  // Logo & Brand
  LOGO: {
    AIRBNB: "/images/airbnb.svg",
    BRAND: "/images/brand.svg",
  },

  // Navigation Icons
  ICONS: {
    SEARCH: "/images/search-icon.svg",
    HEART: "/images/heart.svg",
    MAP: "/images/place-icon.svg", // Adding this

    HEART_FILLED: "/images/heart2.svg",
    USER: "/images/user.svg",
    USER_EMPTY: "/images/userempty.png",
    HAMBURGER: "/images/hamburger.svg",
    FILTER: "/images/filter-icon.svg",
    SETTINGS: "/images/setting-icon.svg",
    INBOX: "/images/inbox-icon.svg",
    SHARE: "/images/share-icon.svg",
  },

  // Amenity Icons
  AMENITIES: {
    WIFI: "/images/wifi-icon.svg",
    TV: "/images/tv-icon.svg",
    POOL: "/images/pool-icon.svg",
    AIR: "/images/air-icon.svg",
    BED: "/images/bed-icon.svg",
    BREAKFAST: "/images/breakfast.svg",
    DRYER: "/images/dryer.svg",
  },

  // Property Images
  PROPERTIES: {
    PROPERTY_1: "/images/property-img1.png",
    PROPERTY_2: "/images/property-img2.png",
    PROPERTY_3: "/images/property-img3.png",
    PROPERTY_4: "/images/property-img4.png",
    PROPERTY_5: "/images/property-img5.png",
    PROPERTY_6: "/images/property-img6.png",
    PROPERTY_7: "/images/property-img7.png",
  },

  // Slide Images
  SLIDES: {
    SLIDE_1: "/images/slide-img1.png",
    SLIDE_2: "/images/slide-img2.png",
    SLIDE_3: "/images/slide-img3.png",
    SLIDE_4: "/images/slide-img4.png",
    SLIDE_5: "/images/slide-img5.png",
  },

  // Arrows & Navigation
  ARROWS: {
    UP: "/images/up-arw.svg",
    DOWN: "/images/down-arw.svg",
    LEFT: "/images/back-arw.svg",
    RIGHT: "/images/right-arw.svg",
    SLIDE: "/images/slide-arw.svg",
    SMALL_RIGHT: "/images/smallrightarw.svg",
    PLACE: "/images/place-arw.svg",
  },

  // Social & Authentication
  SOCIAL: {
    FACEBOOK: "/images/fb.svg",
    GOOGLE: "/images/google.svg",
    APPLE: "/images/apple.svg",
  },

  // Mobile Specific
  MOBILE: {
    ICON_1: "/images/mbl-icon1.svg",
    ICON_2: "/images/mbl-icon2.svg",
    ICON_3: "/images/mbl-icon3.svg",
    ICON_4: "/images/mbl-icon4.svg",
    ICON_5: "/images/mbl-icon5.svg",
    ICON_6: "/images/mbl-icon6.svg",
    ICON_7: "/images/mbl-icon7.svg",
    BED_IMAGE: "/images/mbl-bedimg.png",
    MAP: "/images/mbl-map.png",
    MAIN: "/images/mbl-img.png",
  },

  CATEGORIES: {
    AMAZING_VIEWS: "/images/view-icon.png",
    BEACHFRONT: "/images/categories/beachfront.svg",
    COUNTRYSIDE: "/images/categories/countryside.svg",
    ICONIC_CITIES: "/images/iconic.png",
  },

  // Miscellaneous
  MISC: {
    CALENDAR: "/images/calender.png",
    STAR: "/images/star.svg",
    STAR_BLACK: "/images/blackstar.svg",
    STAR_2: "/images/star2.svg",
    ACTIVE_DOT: "/images/activedot.svg",
    PROTECTION: "/images/protection-icon.svg",
    WORLD: "/images/world-icon.svg",
    MAIL: "/images/mail.svg",
    KEY: "/images/key.svg",
    HAND: "/images/hand.svg",
  },
} as const;

export type ImagePaths = typeof IMAGES;
