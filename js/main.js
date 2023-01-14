const form = document.querySelector('#form');
const inputAdd = document.querySelector('#input');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

//функция, которая записывает все, что есть в ЛС в массив таскс: если условие истинно - оно не пустое, то присвоить все что есть в таскс
if (localStorage.getItem('tasks')){
  tasks = JSON.parse(localStorage.getItem('tasks'))

  //проходим каждый элемент массива и выводим его на экран - код скопировали с функции addTask
  tasks.forEach(task => renderTask(task))
}

checkEmptyList ()

form.addEventListener('submit', addTask) // без (), тк она бы запустилась сразу, а нам надо только по нажатию


tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', completeTask)

// if (localStorage.getItem ('tasksHTML')){
//   tasksList.innerHTML = localStorage.getItem ('tasksHTML')
// } очень плохой способ сохранения данных, тк надо сохранять чистые данные, а не всю разметку html, но как вариант

function addTask (event){
  // event для того чтобы передавать всю информацию при клике
  event.preventDefault() // метод отменяет стандартное поведение

  const textInput = inputAdd.value

  //описали задачу в виде объекта для LS
  const newTask = {
    id: Date.now (),
    text: textInput,
    done: false,
  }

  tasks.push(newTask);

  saveToLS();

  renderTask(newTask);

inputAdd.value = '' // после ввода поле очищается
inputAdd.focus () //указатель после ввода остается 

checkEmptyList ()

// saveHTMLtoLS() плохой сп
}

function deleteTask (event){

  if (event.target.dataset.action !== 'delete') return; // чтобы функция не выполнялась дальше, если это усл верно, то она останавлиется 

  const parentNode = event.target.closest('.list-group-item') //метод closest ищет среди родителей этот элемент, в отличии от querySelector
  

  //удаляем из данных
  
  const id = Number(parentNode.id);

  // 1 вариант удаления задачи из массива по индексу

  //находим индекс задачи в массиве
  const index = tasks.findIndex ((task) => task.id === id)
  // метод похож на forEach, который выполняет функцию для каждого элемента массива, 
  // сравниваем id любой задачи, с id задачи, которую хотим удалить, если тру, то присваиваем index задачи переменной index

  //удаляем задачу из массива
  tasks.splice(index,1) // сначала с какого элемента начать, потом сколько удалить
//--------------------------------

// 2 вариант удаления задачи через фильтр

  tasks = tasks.filter (task =>
    // if (task.id === id){
    //   return false} 
    //   else { return true }
      //или
      task.id !== id
  )

  saveToLS();

  //удаляем из разметки
  parentNode.remove ()

  checkEmptyList ()

  // saveHTMLtoLS() плохой сп
}

//делаем задачу завершенной - зачеркнутой

function completeTask (event){

  if (event.target.dataset.action !== 'done') return; // чтобы функция не выполнялась дальше, если это усл верно, то она останавлиется 

  const parentNode = event.target.closest('.list-group-item')

  const id = Number(parentNode.id);

  const task = tasks.find ((task) => task.id === id)
  // метод похож на forEach, который выполняет функцию для каждого элемента массива, 
  // сравниваем id любой задачи, с id задачи, которую хотим зачеркнуть, если тру, то присваиваем этот элемент task

  task.done = !task.done //присваиваем обратное значение
  
  const taskTitle = parentNode.querySelector('.task-title')
  taskTitle.classList.toggle('task-title--done')// без точки в скобках, тк уже classList написан
  // используем toggle, а не просто add, чтобы при повторном нажатии класс удалялся (переключение)

  saveToLS();

  // saveHTMLtoLS() плохой сп
}

function checkEmptyList (){ // надо запускать каждый раз - вставили в каждый блок
  if (tasks.length === 0){
      const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
      <div class="empty-list__title">Список дел пуст</div>
     </li>`
     tasksList.insertAdjacentHTML('afterbegin', emptyListHTML) //добавляем html элемент только при каком-то усл, в скобках указываем куда вставляем и что
  }

  if (tasks.length > 0){
    const emptyListEl = document.querySelector ('#emptyList')
    emptyListEl ? emptyListEl.remove() : null;
  }

}

function saveToLS() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
  //метод принимает эл в ЛС, первое зн - по какому ключу добавляем, 2ой - что хотим добавить, когда хотим добавить массив или объект, необходимо трасформировать с JSON строку
}

function renderTask(task){
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
  // какое значиние идет в ЛС, (условие ? true : false) - когда задача выполнена, срабатывает true и присвается доп класс, когда не выполнена, то остается false
  
  const formTodo = `<li id="${task.id}" class="list-group-item d-flex         justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                      <button type="button" data-action="done" class="btn-action">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                      </button>
                      <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                      </button>
                    </div>
                  </li>`
  //добавили в обратные ковычки html код и поменяли текст с помощью $
  
  tasksList.insertAdjacentHTML('beforeend', formTodo) //добавляем в ul элементы списка путем метода, в скобках указываем куда вставляем и что
}

// function saveHTMLtoLS(){
//   localStorage.setItem ('tasksHTML', tasksList.innerHTML)
// } плохой способ