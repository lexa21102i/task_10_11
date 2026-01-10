// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

const colorPriority = {
  'красный': 1,
  'оранжевый': 2,
  'желтый': 3,
  'зеленый': 4,
  'голубой': 5,
  'синий': 6,
  'фиолетовый': 7,
  'розовый': 8,
  'розово-красный': 8.5, // специальный случай
  'белый': 9,
  'черный': 10,
  'коричневый': 11,
  'светло-коричневый': 11.5, // специальный случай
  'серый': 12
};

const getColorPriority = (color) => {
const normalizedColor = color.toLowerCase();
  return colorPriority[normalizedColor] !== undefined 
    ? colorPriority[normalizedColor] 
    : 'не определен';
};

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = '';
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits

  for (let i = 0; i < fruits.length; i++) {
    const li = document.createElement('li');
    let colorClass = '';
    switch (fruits[i].color.toLowerCase()) {
      case 'фиолетовый':
        colorClass = 'fruit_violet';
        break;
      case 'зеленый':
        colorClass = 'fruit_green';
        break;
      case 'розово-красный':
      case 'розовый':
        colorClass = 'fruit_carmazin';
        break;
      case 'желтый':
        colorClass = 'fruit_yellow';
        break;
      case 'светло-коричневый':
      case 'коричневый':
        colorClass = 'fruit_lightbrown';
        break;
      case 'красный':
        colorClass = 'fruit_red';
        break;
      case 'оранжевый':
        colorClass = 'fruit_orange';
        break;
      case 'голубой':
      case 'синий':
        colorClass = 'fruit_blue';
        break;
      default:
        colorClass = 'fruit_default';
    }
    li.classList.add('fruit__item', colorClass);
    li.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color} (приоритет: ${getColorPriority(fruits[i].color)})</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>
    `;
    fruitsList.appendChild(li);
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  const originalFruits = [...fruits];
  let result = [];
  let tempFruits = [...fruits];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (tempFruits.length > 0) {
    const randomIndex = getRandomInt(0, tempFruits.length - 1);
    const randomFruit = tempFruits.splice(randomIndex, 1)[0];
    result.push(randomFruit);
  }
  let hasChanged = false;
  for (let i = 0; i < originalFruits.length; i++) {
    if (originalFruits[i] !== result[i]) {
      hasChanged = true;
      break;
    }
  }

  if (!hasChanged) {
    alert('Порядок фруктов не изменился! Попробуйте еще раз.');
  }
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

const minWeightInput = document.querySelector('.minweight__input');
const maxWeightInput = document.querySelector('.maxweight__input');

// фильтрация массива
const filterFruits = () => {
  const minWeight = parseFloat(minWeightInput.value);
  const maxWeight = parseFloat(maxWeightInput.value);
  if (isNaN(minWeight) || isNaN(maxWeight)) {
    alert('Пожалуйста, введите корректные значения для min и max weight');
    return;
  }
  if (minWeight > maxWeight) {
    alert('min weight не может быть больше max weight');
    return;
  }
  fruits = fruits.filter((fruit) => {
    return fruit.weight >= minWeight && fruit.weight <= maxWeight;
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
  minWeightInput.value = '';
  maxWeightInput.value = '';
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const colorA = a.color.toLowerCase();
  const colorB = b.color.toLowerCase();

  const priorityA = colorPriority[colorA];
  const priorityB = colorPriority[colorB];

  if (priorityA !== undefined && priorityB !== undefined) {
    return priorityA - priorityB;
  }
  if (priorityA !== undefined && priorityB === undefined) {
    return -1;
  }
  if (priorityA === undefined && priorityB !== undefined) {
    return 1;
  }

  if (colorA < colorB) {
    return -1;
  }
  if (colorA > colorB) {
    return 1;
  }
  return 0;
  // TODO: допишите функцию сравнения двух элементов по цвету
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    // TODO: допишите функцию сортировки пузырьком
  },

  quickSort(arr, comparation) {
    const partition = (array, low, high) => {
      const pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (comparation(array[j], pivot) <= 0) {
          i++;
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
      const temp = array[i + 1];
      array[i + 1] = array[high];
      array[high] = temp;
      return i + 1;
    };
    const quickSortRecursive = (array, low, high) => {
      if (low < high) {
        const pi = partition(array, low, high);
        quickSortRecursive(array, low, pi - 1);
        quickSortRecursive(array, pi + 1, high);
      }
    };
    quickSortRecursive(arr, 0, arr.length - 1);
    // TODO: допишите функцию быстрой сортировки
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
  sortTimeLabel.textContent = '-';
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  setTimeout(() => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  const fruitsCopy = [...fruits];
  sortAPI.startSort(sort, fruitsCopy, comparationColor);
  fruits = fruitsCopy;
  display();
  sortTimeLabel.textContent = sortTime;
}, 0);
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseFloat(weightInput.value);
  if (!kind) {
    alert('Пожалуйста, введите название фрукта (kind)');
    return;
  }
  
  if (!color) {
    alert('Пожалуйста, введите цвет фрукта (color)');
    return;
  }
  
  if (isNaN(weight) || weight <= 0) {
    alert('Пожалуйста, введите корректный вес фрукта (положительное число)');
    return;
  }

  if (typeof weight !== 'number' || isNaN(weight)) {
    alert('Вес должен быть числом');
    return;
  }

  const newFruit = {
    kind: kind,
    color: color,
    weight: weight
  };

  fruits.push(newFruit);

  kindInput.value = '';
  colorInput.value = '';
  weightInput.value = '';
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  display();
  sortTimeLabel.textContent = '-';
});
