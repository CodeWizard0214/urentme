import { APP_PATH } from '../apis/API';

import noImage from '../assets/images/noimage.jpg'
import smallLogo from '../assets/images/logo-medium.png';
import noAvatar from '../assets/images/no_avatar.png';

const getThumbImage = (path, width) => {
  const w = width ?? 240;
  return `${APP_PATH}/timthumb.php?src=${path}&w=${w}&a=t%27&zc=1`;
}

export const getDefaultImageUri = (itemImages, id, width) => {
  if (!itemImages || itemImages.length === 0) {
    return noImage;
  }

  const images = itemImages.filter((e) => e.item_id === id);
  if (!images || images.length === 0) {
    return noImage;
  }

  const defaultImg = images.filter((it) => it.is_default === 1);
  const item = defaultImg.length > 0 ? defaultImg[0] : images[0];
  const w = width ?? 664;
  return getThumbImage(`${APP_PATH}/app/webroot/img/item/image/${item.name}`, w);
};

export const getItemImageUris = (itemImages, id) => {
  if (!itemImages || itemImages.length === 0) {
    return [];
  }

  const images = itemImages.filter((e) => e.item_id === id);
  if (!images || images.length === 0) {
    return [];
  }

  let list = [];
  for (const item of images) {
    const url = `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/item/image/${item.name}&w=664&a=t%27&zc=1`;
    if (item.is_default) {
      list.unshift(url);
    } else {
      list.push(url);
    }
  }

  return list;
}

export const getImageUriFromName = (fname, thumb) => {
  if (thumb) {
    return `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/item/image/${fname}&w=160&a=t%27&zc=1`;
  }
  return `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/item/image/${fname}&w=664&a=t%27&zc=1`;
}

export const getUserAvatar = (image) => {
  return image ? `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/profile/${image}&w=65&a=t%27&zc=1` : smallLogo;
}

export const getAdminAvatar = (image) => {
  return image ? `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/Admin/profile/${image}&w=60&h=60&a=t` : noAvatar;
}

export const getMemberAvatar = (image) => {
  return image ? `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/profile/${image}&w=65&a=t%27&zc=1` : noAvatar;
}

export const getDriverLicenseImage = (filename) => {
  return `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/files/userids/${filename}&w=240&a=t%27zc=1`;
}

export const getReviewPhoto = (filename, thumb) => {
  if (thumb) {
    return `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/files/review_photos/${filename}&w=65&a=t%27&zc=1`;
  } else {
    return `${APP_PATH}/app/webroot/files/review_photos/${filename}`;
  }
};

export const getTipImage = (id) => {
  return id ? `${APP_PATH}/app/webroot/img/front_home/images/hiw_tab_${id}.svg` : smallLogo;
}

export const getTipActiveImage = (id) => {
  return id ? `${APP_PATH}/app/webroot/img/front_home/images/hiw_tab_${id}_active.svg` : smallLogo;
}

export const getProfileImage = (image) => {
  return image ? `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/profile/${image}&w=240&a=t%27&zc=1` : noImage;
}

export const getTestimonialImage = (image) => {
  return image ? `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/testimonials/${image}&w=160a=t%27&zc=1` : noImage;
}

export const getBlogImage = (image) => {
  return image ? `${APP_PATH}/timthumb.php?src=${APP_PATH}/app/webroot/img/blog/${image}&w=160&h=160&a=t` : noImage;
}
