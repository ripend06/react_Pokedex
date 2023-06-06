import { useEffect, useState } from "react";
import './App.css';
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import Card from "./components/Card/Card";
import Navber from "./components/Navber/Navber";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/"; //ポケモンAPI　URL
  const [loading, setLoading] = useState(true); //初期値ture
  const [pokemonData, setPokemonData] = useState([]); //配列
  const [nextURL, setNextURL] = useState(""); //文字列
  const [prevURL, setPrevURL] = useState(""); //文字列

  useEffect(() => { //useEffect＋[] でロード時　初期に１回だけ表示

    // ポケモンAPIからデータを取得する関数 //
    const fetchPokemonData = async () => { // 非同期関数でAPI情報を取得する

      //すべてのポケモンデータを取得
      let res = await getAllPokemon(initialURL); //initialURL =　https://pokeapi.co/api/v2/pokemon/　| getAllPokemon関数は　./utils/pokemon.js参照
      console.log("読み込み完了");
      console.log(res); //initialURL のJSONデータ参照

      //各ポケモンの詳細データを取得
      loadPokemon(res.results); //各ポケモンの詳細データを取得
      //console.log(res.results);
      //console.log(res.next);

      //ページネーション機能
      setNextURL(res.next); //状態変数set関数使用
      setPrevURL(res.previous); //初期nullになる

      //ロード完了
      setLoading(false);
    };
    fetchPokemonData(); //実行
  }, []);

  //各ポケモンの詳細データを取得
  const loadPokemon = async (data) => { //【data = res.results】
    let _pokemonData = await Promise.all( //Primise.allで各ポケモンの詳細データをすべて処理する
      data.map((pokemon) => { //mapメソッドで配列を一個一個に処理を加え　再び格納　【pokemon　＝　再び格納した配列(retunの値)】
        //console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url); //getPokemon関数で、pokemon.url のすべてのポケモンデータを取得　JSONで返す
        return pokemonRecord; //pokemon.urlのJSONデータを配列にして返す
      })
    );
    setPokemonData(_pokemonData); //ただ_pokemonDataの値が見たかっただけに set関数使用 「_pokemonData = pokemonData」
  };

  //console.log(pokemonData);

  // 次へボタン関数 //
  const handleNextPage = async () => {
    setLoading(true); //ロード中　文字出力
    let data = await getAllPokemon(nextURL); //nextURL = setNextURL(res.next);
    //console.log(data);
    await loadPokemon(data.results); //各ポケモンの詳細データを取得
    setNextURL(data.next); //nextURLの値を更新してる　次へ３＋＋ページ目
    setPrevURL(data.previous); //prevURLのURLの値を更新してる　前へページ
    setLoading(false); //ロード完了
  };

  // 戻るボタン関数 //
  const handlePrevPage = async () => {
    if(!prevURL) return; //１ページ目がnullの場合は何もしない

    setLoading(true); //ロード中　文字出力
    let data = await getAllPokemon(prevURL); //setPrevURL(res.previous); //初期nullになる
    await loadPokemon(data.results); //各ポケモンの詳細データを取得
    setNextURL(data.next); //nextURLの値を更新してる　次へページ
    setPrevURL(data.previous); //prevURLのURLの値を更新してる　前へページ
    setLoading(false); //ロード完了
  };

  return (
    //Navberコンポーネント ヘッダー
    //３項演算子使用 「処理 ? (A) : (B);」 読み込み中　読み込み完了
    //Cardコンポーネント　propsで pokemon使用
      //pokemonData.map((pokemon, i) 　「【pokemonData = Primise.all】で各ポケモンの詳細データをすべて処理する」をmapメソッド使用して、HTML側で　１つ１つ表示させてる
    <>
      <Navber />
      <div className="App">
        {loading ? (
          <h1>ロード中</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
