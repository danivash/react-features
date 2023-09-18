import React, {useEffect, useState} from 'react';
import  './DunamicPagination.css'

const DynamicPagination = () => {
    interface FetchingData  {
        albumId: number
        id: number
        title: string
        url: string
        thumbnailUrl: string
    }
    const [data, setData] = useState<FetchingData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState(0) // on future,
    const [totalCountRendered, setTotalCountRendered] = useState(10);
    const scrollHandle = (e:any) => {
        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 150 && data.length < 5000) // change const 5000 to totalCount
        setIsFetching(true);
    }

    const  fetchData = async () => {
        await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${currentPage}`)
            .then(response => response.json())
            // here must be added setTotalCount(response.headers['x-total-count'])
            .then(json => {
                setData([...data, ...json]);
                setCurrentPage(prevState => prevState + 1);
                setTotalCountRendered(data.length + 10)  //костыль добработать -- remove const 10
            })
            .finally(()=> setIsFetching(false));
    }
    useEffect( ()=> {
        document.addEventListener("scroll",  scrollHandle)
        return function () {
            document.removeEventListener("scroll", scrollHandle)
        }
    }, [])

    useEffect( ()=> {
        isFetching && fetchData()
    }, [isFetching])
    return (
        <div>
            <h2 className='counter'>{totalCountRendered}</h2>
            {data.map((item)=> (
                <div className='main' key={item.id} >
                    <h2>{item.title}</h2>
                    <img src={item.thumbnailUrl}/>
                </div>
            ))}
        </div>
    );
};

export default DynamicPagination;