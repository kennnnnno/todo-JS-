const storage = localStorage;

const table = document.querySelector('table');     // 表
const todo = document.getElementById('todo');      // TODO
const priority = document.querySelector('select'); // 優先度
const deadline = document.querySelector('input[type="date"]');  // 締切
const submit = document.getElementById('submit');  // 登録ボタン

let list = []; //TODOリストのデータ


//表にアイテムを追加する関数
const addItem = (item) =>{
        const tr = document.createElement("tr");

    for(const prop in item){
        const td = document.createElement("td"); //各td要素を作成
        if(prop=="done"){//項目がdoneの場合
            const checkbox = document.createElement('input');  // 要素生成
            checkbox.type = 'checkbox';    // type属性をcheckboxに
            checkbox.checked = item[prop]; // checked属性を設定
            td.appendChild(checkbox);      // td要素の子要素に   
            checkbox.addEventListener("change",checkBoxListener);    
        }
        else{
            td.textContent = item[prop];//各tdのテキストを指定
        }

        tr.appendChild(td);//tdをtrの子要素に追加
    }

    table.appendChild(tr);

}


document.addEventListener("DOMContentLoaded",()=>{
  // 1. ストレージデータ（JSON）の読み込み
  const json = storage.todoList;
  if (json == undefined) {
  return;  // ストレージデータがない場合は何もしない
}
  // 2. JSONをオブジェクトの配列に変換して配列listに代入
  list = JSON.parse(json);
  // 3. 配列listのデータを元にテーブルに要素を追加
  for(const item of list){
    addItem(item);
  }
});

//todo登録ボタン
submit.addEventListener("click",()=>{

    const item = {}; //入力値を一時的に格納するオブジェクト
    if(todo.value==""){
        window.alert("TODOを入力してください。");
        return;
    }
    else if(priority.value==""){
        window.alert("優先度を入力してください。");
        return;
    }
    else if(deadline.value==""){
        window.alert("期日を入力してください。");
        return;
    }



    item.todo = todo.value;
    item.priority = priority.value;
    item.deadline = deadline.value;
    item.done = false; 
    console.log(item); 

    todo.value="";
    priority.value = "普";
    deadline.value = "";

    addItem(item);

    list.push(item);
    storage.todoList = JSON.stringify(list);

});

const clearTable = () => {   //TODO リストをヘッダー以外削除するコード
    const trList = Array.from(document.getElementsByTagName("tr"));
    trList.shift();
    for (const tr of trList){
        tr.remove();
    }
};

const filterButton = document.createElement("button"); //ボタン要素を作成
filterButton.textContent = "優先度(高)で絞り込み";
filterButton.id = "priority"; //CSSでの装飾用
const main = document.querySelector("main");
main.appendChild(filterButton);

filterButton.addEventListener("click",() => {

    clearTable();


    for(const item of list){
        if(item.priority == "高"){
            addItem(item);
        }
    }
})

const remove = document.createElement("button");
remove.textContent = "完了したTODOを削除する";
remove.id = "remove";   ///CSS装飾用
const br = document.createElement("br"); //改行したい
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener("click",() => {
        clearTable();
    
        //1. 未完了のTODOを抽出して定数listを置き換え
        list = list.filter((item)=> item.done ==  false);
        //2. TODOデータをテーブルに追加
        for (const item of list) {
            addItem(item);
        }
        //3.　ストレージデータを更新
        storage.todoList = JSON.stringify(list);
    }
);
const checkBoxListener = (ev) => {
  // 1-1. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementsByTagName('tr'));

  // 1-2. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev.currentTarget.parentElement.parentElement;

  // 1-3. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;

  // 2. 配列listにそのインデックスでアクセスしてdoneを更新
  list[idx].done = ev.currentTarget.checked;

  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
};
