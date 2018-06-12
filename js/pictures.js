'use strict';

var QUANTITY_PHOTOS = 25;
var MIN_QUANTITY_LIKES = 15;
var MAX_QUANTITY_LIKES = 250;

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var description = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

/**
 * Функция возвращает случайное целое число в заданнном дияпазоне
 * @param min {numbers} минисальное число
 * @param max {numbers} максимадьное число
 * @returns {number} случайное число
 */

var getRandomNumbers = function (min, max) {
  return Math.round((max - min - 1) * Math.random() + 1);
};

/**
 * Функция возврвщает случайный элемент массива
 * @param elem массив
 * @returns {number} случайный элемент массива
 */

var getRandomElement = function (elem) {
  var randomIndex = Math.round(Math.random() * (elem.length - 1));
  return elem[randomIndex];
};

/**
 * Функция генерирует одну фотографию
 * @param elements {numbers} количество фотографий
 */

var generatePhoto = function (elements) {
  var photo = {};
  photo.url = 'photos/' + elements + '.jpg';
  photo.likes = getRandomNumbers(MIN_QUANTITY_LIKES, MAX_QUANTITY_LIKES);
  photo.comments = [];
  photo.comments[0] = getRandomElement(comments);
  if (getRandomNumbers(0, 1)) {
    do {
      photo.comments[1] = getRandomElement(comments);
    }
    while (photo.comments[1] === photo.comments[0]);
  }
  photo.description = getRandomElement(description);

  return photo;
};

// Массив фотографий

var photos = [];

// Цикл вставки фотографий в массив

for (var i = 1; i <= QUANTITY_PHOTOS; i++) {
  photos.push(generatePhoto(i));
}

// Находим шаблон и его содержимое в DOM-дереве

var photoTemplate = document.querySelector('#picture').content;

/**
 * Функция рендерит фотографии на страницу
 * @param photoArray - массив фотографий
 */

var renderPhotos = function (photoArray) {
  var photosElement = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (i = 0; i <= photoArray.length - 1; i++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photoArray[i].url;
    photoElement.querySelector('.picture__stat--likes').textContent = photoArray[i].likes;
    photoElement.querySelector('.picture__stat--comments').textContent = photoArray[i].comments.length;
    fragment.appendChild(photoElement);
  }
  photosElement.appendChild(fragment);
};

renderPhotos(photos);

var bigPhoto = document.querySelector('.big-picture');

/**
 * Функция рендерит большую фотографию
 * @param picture {*} данные одной фотографии
 */
var renderBigPhoto = function (picture) {
  bigPhoto.classList.remove('hidden');
  bigPhoto.querySelector('.big-picture__img').src = picture.url;
  bigPhoto.querySelector('.comments-count').textContent = picture.comments.length;
  bigPhoto.querySelector('.likes-count').textContent = picture.likes;

  var fragment = document.createDocumentFragment();

  for (i = 0; i <= picture.comments.length - 1; i++) {
    var comment = document.createElement('li');
    var avatar = document.createElement('img');
    var text = document.createElement('p');
    comment.classList.add('social__comment', 'social__comment--text');
    avatar.classList.add('social__picture');
    avatar.src = 'img/avatar-' + getRandomNumbers(1, 6) + '.svg';
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = '35';
    avatar.height = '35';
    text.textContent = picture.comments[i];
    comment.appendChild(avatar);
    comment.appendChild(text);
    fragment.appendChild(comment);
  }
  bigPhoto.querySelector('.social__comments').appendChild(fragment);
  bigPhoto.querySelector('.social__caption').textContent = picture.description;
};

renderBigPhoto(photos[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__loadmore').classList.add('visually-hidden');
