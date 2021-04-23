import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const  defaultEndpoint = "https://rickandmortyapi.com/api/character";

//funcion para llamar a la API
export async function getServerSideProps(){
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return{
    props: {
      data
    }
  }
}



export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
  const [results, setResults] = useState(defaultResults);
  const [page, setPage] = useState({
    ...info,
    current: defaultEndpoint
  });

  const { current }= page;

  useEffect(() => {
    if (current === defaultEndpoint ) return;
    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      setPage({
        current,
        ...nextData.info
      });

      if ( !nextData.info?.prev ) {
        setResults(nextData.results);
        return;
      }

      setResults( prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    setPage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty Wiki App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Rick and Morty Wiki App
        </h1>
        
        <p className={styles.description}>
          Wubba Lubba Dub dub !!!
        </p>

        <ul className={styles.grid}>
          {results.map(result => {
            const { id, name, image } = result;

            return (
              <li key={ id } className={styles.card}>
            <a>
              <h3>{ name }</h3>
              <img src={image} alt ={name}/>
            </a>
          </li>
            )
          })}
        </ul>

        <p>
          <button onClick={handleLoadMore}>Give me more...</button>
        </p>

      </main>

      <footer className={styles.footer}>
        <p>Made by NOE-PS</p>
      </footer>
    </div>
  )
}
