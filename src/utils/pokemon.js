//すべてのポケモンデータを取得　JSONで返す
export const getAllPokemon = (url) => { //【url = initialURL】 res.json()を格納
    return new Promise((resolve, reject) => { //Promiseで非同期処理
        //console.log(url); //url = initialURL
        console.log("５秒後実行します"); //
        setTimeout(function() { //resolveする前の処理書ける　例として５秒後にresolve実行
            fetch(url) //fetchでAPIをJsonへ変換 【url = initialURL】
                .then((res) => res.json()) //【res = res.json()】
                .then((data) => resolve(data)); //resolve(res.json())　【data = res = res.json()】
        }, 0);
    });
}

//各ポケモンのデータを取得　JSONで返す
export const getPokemon = (url) => { //【url = pokemon.url】
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                //console.log(data);
                resolve(data);
            });

    });
};