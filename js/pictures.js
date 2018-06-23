'use strict';
var ESC = 27;
var QUANTITY_PHOTOS = 25;
var QUNTITY_AVATAR_MIN = 1;
var QUNTITY_AVATAR_MAX = 6;
var MIN_QUANTITY_LIKES = 15;
var MAX_QUANTITY_LIKES = 250;

var RESIZE_MIN = 25;
var RESIZE_MAX = 100;
var RESIZE_STEP = 25;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION = [
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


var bigPhoto = document.querySelector('.big-picture'); // элемент большая картинка
var photoTemplate = document.querySelector('#picture').content; // находит шаблон со всем содержимым
var bigPhotoClose = document.querySelector('.big-picture__cancel'); // крестик закрыти большой картинки
var photoList = document.querySelector('.pictures'); // находит конйнер для фотографий


var getRandomNumbers = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Функция создает и возвращает массив комментариев (1 или 2 комментария)
 * @returns {Array}
 */

var getRandomCommentsArray = function () {
  var arrayComments = [];

  for (var i = 0; i < getRandomNumbers(1, 2); i++) {
    arrayComments[i] = COMMENTS[getRandomNumbers(0, COMMENTS.length - 1)];
  }

  return arrayComments;
};

/**
 * Функция создает фото
 * @param quantity - количество фото
 * @returns {Array} - возвращает массив фото
 */

var getPhoto = function (quantity) {
  var photos = [];

  for (var i = 0; i < quantity; i++) {
    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumbers(MIN_QUANTITY_LIKES, MAX_QUANTITY_LIKES),
      comments: getRandomCommentsArray(),
      description: DESCRIPTION[getRandomNumbers(0, DESCRIPTION.length - 1)]
    });
  }

  return photos;
};

var infoPhoto = getPhoto(QUANTITY_PHOTOS); // запускает создание массива фотографий

var addClickListener = function (data, photoElement) {
  photoElement.querySelector('a').addEventListener('click', function (evt) {
    evt.preventDefault();
    getBigPhoto(data);
    bigPhoto.classList.remove('hidden');
  });
};

bigPhotoClose.addEventListener('click', function () {
  bigPhoto.classList.add('hidden');
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC) {
    bigPhoto.classList.add('hidden');
  }
});
/**
 * Функция генерирует картинки из шаблона
 * @param {*} info - массив данных
 * @return {DocumentFragment} fragment - возвращает клонированый и заполненый шаблон
 */
var generatePhotos = function (info) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < info.length; i++) {
    var photoElement = photoTemplate.cloneNode(true);

    var data = info[i];

    photoElement.querySelector('img').src = info[i].url;
    photoElement.querySelector('.picture__stat--likes').textContent = info[i].likes;
    photoElement.querySelector('.picture__stat--comments').textContent = info[i].comments.length;

    addClickListener(data, photoElement);

    fragment.appendChild(photoElement);
  }

  return fragment;
};


/**
 * Функция создает и рендерит большое фото(удаляя статичные комменты и добавляя случайные из массива комменитов)
 * @param {*} data - массив данных со случайными данными.
 */
var getBigPhoto = function (data) {
  var fragment = document.createDocumentFragment();

  bigPhoto.querySelector('img').src = data.url;
  bigPhoto.querySelector('.likes-count').textContent = data.likes;
  bigPhoto.querySelector('.comments-count').textContent = data.comments.length;
  bigPhoto.querySelector('.social__caption').textContent = data.description;

  var photoComments = bigPhoto.querySelector('.social__comments');
  var exampleComments = bigPhoto.querySelectorAll('.social__comment');

  for (var i = 0; i < exampleComments.length; i++) {
    photoComments.removeChild(exampleComments[i]);
  }

  for (i = 0; i < data.comments.length; i++) {

    var comment = document.createElement('li');
    var avatar = document.createElement('img');
    var text = document.createElement('p');
    comment.classList.add('social__comment', 'social__comment--text');
    avatar.classList.add('social__picture');
    avatar.src = 'img/avatar-' + getRandomNumbers(QUNTITY_AVATAR_MIN, QUNTITY_AVATAR_MAX) + '.svg';
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = '35';
    avatar.height = '35';
    text.textContent = data.comments[i];
    comment.appendChild(avatar);
    comment.appendChild(text);
    fragment.appendChild(comment);
  }
  photoComments.appendChild(fragment);

  bigPhoto.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPhoto.querySelector('.social__loadmore').classList.add('visually-hidden');
};

photoList.appendChild(generatePhotos(infoPhoto)); // вставляет фотографии  в контейнер


//  Загрузка фото + эффекты
var formUpload = document.querySelector('.img-upload__overlay');
var inputUpload = document.querySelector('#upload-file');
var previewImageUpload = formUpload.querySelector('.img-upload__preview');
var uploadFormCancel = formUpload.querySelector('#upload-cancel');

var scaleSlider = document.querySelector('.img-upload__scale');

/**
 * Функция закрывает попап при нажатии на ESC
 * @param {object} evt
 */
var pressEscPopupCloseHandler = function (evt) {
  if (evt.keyCode === ESC) {
    closeUpload();
  }
};

/**
 * Функция открытия попапа загрузки фото
 */
var openUpload = function () {
  formUpload.classList.remove('hidden'); // Показать форму загрузки
  scaleSlider.classList.add('hidden'); //  Скрыть слайдер (эффекты)
  document.addEventListener('keydown', pressEscPopupCloseHandler); // Обработчик
};
/**
 * Функция закрытия попапа загрузки фото
 */
var closeUpload = function () {
  formUpload.classList.add('hidden'); //  Скрыть форму загрузки
  inputUpload.value = ''; //  Сбросить ввод для правильной работы

  document.removeEventListener('keydown', pressEscPopupCloseHandler); // Обработчик
};

inputUpload.addEventListener('change', openUpload); // Обработчик для открытия формы загрузки и отображения изображения

uploadFormCancel.addEventListener('click', closeUpload); // Обработчик для закрытия формы загрузки

// Эффекты для фото
var scalePin = document.querySelector('.scale__pin');
var scaleValue = document.querySelector('.scale__value');

var effectsList = document.querySelector('.effects__list');
var effectClass; // Пустая переменная для функций эффектов: switchEffects и controlSaturation

/**
 * Функция включает эффект для фото
 * @param {object} evt
 */
var switchEffectsPhotos = function (evt) {
  previewImageUpload.classList.remove(effectClass);

  if (evt.target.tagName === 'INPUT') {
    previewImageUpload.style.filter = '';

    var idText = evt.target.id;
    idText = idText.split('-')[1];
    effectClass = 'effects__preview--' + idText;
    previewImageUpload.classList.add(effectClass);

    if (effectClass === 'effects__preview--none') {
      scaleSlider.classList.add('hidden');
    } else {
      scaleSlider.classList.remove('hidden');
    }
  }
};

var levelSaturation = function () {
  if (effectClass === 'effects__preview--chrome') {
    previewImageUpload.style.filter = 'grayscale(' + (scaleValue.value / 100) + ')';
  } else if (effectClass === 'effects__preview--sepia') {
    previewImageUpload.style.filter = 'sepia(' + (scaleValue.value / 100) + ')';
  } else if (effectClass === 'effects__preview--marvin') {
    previewImageUpload.style.filter = 'invert(' + scaleValue.value + '%)';
  } else if (effectClass === 'effects__preview--phobos') {
    previewImageUpload.style.filter = 'blur(' + (scaleValue.value * 3 / 100) + 'px)';
  } else if (effectClass === 'effects__preview--heat') {
    previewImageUpload.style.filter = 'brightness(' + ((scaleValue.value * 2 / 100) + 1) + ')';
  } else {
    previewImageUpload.style.filter = '';
  }
};

effectsList.addEventListener('click', switchEffectsPhotos); // Обработчик эффектов для фото

scalePin.addEventListener('mouseup', levelSaturation); // Обработчик уровня эффектов

//  Размер для фото
var resizeControlValue = document.querySelector('.resize__control--value');
var resizeControlMinus = document.querySelector('.resize__control--minus');
var resizeControlPlus = document.querySelector('.resize__control--plus');

resizeControlValue.value = RESIZE_MAX + '%';

var resizePhoto = function (evt) {
  var valueString = resizeControlValue.value.split('%')[0];
  var valueNumber = parseInt(valueString, 10);

  if (resizeControlValue.value !== (RESIZE_MAX + '%') && evt.target.className === 'resize__control resize__control--plus') {
    valueNumber += RESIZE_STEP;
  } else if (resizeControlValue.value !== (RESIZE_MIN + '%') && evt.target.className === 'resize__control resize__control--minus') {
    valueNumber -= RESIZE_STEP;
  } else {
    return;
  }

  valueString = valueNumber + '%';
  resizeControlValue.value = valueString;
  previewImageUpload.style.transform = 'scale(' + (valueNumber / 100) + ')';
};

resizeControlMinus.addEventListener('click', resizePhoto); // Обработчик уменьшеня фото

resizeControlPlus.addEventListener('click', resizePhoto); // Обработчик увеличения фото
