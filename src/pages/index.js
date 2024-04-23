import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'
import fetch from 'node-fetch'
import Papa from 'papaparse'
import Chart from 'chart.js/auto'
export default function Home({ data }) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showTotal, setShowTotal] = useState(true);
  const [showMales, setShowMales] = useState(true);
  const [showFemales, setShowFemales] = useState(true);
  const [chartData, setChartData] = useState(null);

  const regionLabels = data.populations.data.slice(1).map(item => item[0]);
  const totalPopulations = data.populations.data.slice(1).map(item => item[1]);
  const males = data.populations.data.slice(1).map(item => item[2]);
  const females = data.populations.data.slice(1).map(item => item[3]);

  useEffect(() => {
    if (selectedRegion === "") {
      setChartData({
        labels: regionLabels,
        datasets: [
          {
            label: 'Всего',
            data: totalPopulations,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
          },
          {
            label: 'Мужчины',
            data: males,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          },
          {
            label: 'Женщины',
            data: females,
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgb(255, 205, 86)',
            borderWidth: 1
          }
        ]
      });
    } else {
      const selectedIndex = regionLabels.indexOf(selectedRegion);
      setChartData({
        labels: ['Всего', 'Мужчины', 'Женщины'],
        datasets: [
          {
            label: selectedRegion,
            data: [totalPopulations[selectedIndex], males[selectedIndex], females[selectedIndex]],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 205, 86, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            borderWidth: 1
          }
        ]
      });
    }
  }, [selectedRegion]);

  const handleChangeRegion = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleChangeShowTotal = () => {
    setShowTotal(!showTotal);
  };

  const handleChangeShowMales = () => {
    setShowMales(!showMales);
  };

  const handleChangeShowFemales = () => {
    setShowFemales(!showFemales);
  };

  return (
    <>
      <Head>
        <title>City Populations</title>
        <meta name="description" content="City populations dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-center text-sky-800">
          Население городов Казахстана по регионам
        </h3>
        <div className="flex items-center justify-center mb-4">
          <select
            className="border border-gray-300 rounded-md p-2 mr-2"
            value={selectedRegion}
            onChange={handleChangeRegion}
          >
            <option value="">Выберите регион</option>
            {regionLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
          <div className="space-x-2">
            <input
              type="checkbox"
              id="showTotal"
              checked={showTotal}
              onChange={handleChangeShowTotal}
            />
            <label htmlFor="showTotal" className="text-gray-700">Показать Всего</label>
            <input
              type="checkbox"
              id="showMales"
              checked={showMales}
              onChange={handleChangeShowMales}
            />
            <label htmlFor="showMales" className="text-gray-700">Показать Мужчин</label>
            <input
              type="checkbox"
              id="showFemales"
              checked={showFemales}
              onChange={handleChangeShowFemales}
            />
            <label htmlFor="showFemales" className="text-gray-700">Показать Женщин</label>
          </div>
        </div>
        {chartData && (
          <div className="w-full mx-auto mb-4">
            <Bar
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Население городов Казахстана по регионам',
                    font: {
                      size: 16
                    }
                  },
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                },
                responsive: true,
                maintainAspectRatio: false
              }}
              data={chartData}
              height={400}

            />
          </div>
        )}
        {selectedRegion && (
          <div className="w-full mx-auto mb-4">
            <h4 className="text-xl font-semibold mb-2 text-center">Данные по выбранному региону: {selectedRegion}</h4>
            <table className="table-auto border-collapse border border-gray-400 mx-auto">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Показатель</th>
                  <th className="border border-gray-400 px-4 py-2">Значение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Всего</td>
                  <td className="border border-gray-400 px-4 py-2">{totalPopulations[regionLabels.indexOf(selectedRegion)]}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Мужчины</td>
                  <td className="border border-gray-400 px-4 py-2">{males[regionLabels.indexOf(selectedRegion)]}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Женщины</td>
                  <td className="border border-gray-400 px-4 py-2">{females[regionLabels.indexOf(selectedRegion)]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-4 mx-auto">
          <a href="https://github.com/open-data-kazakhstan/city-population.git" className="text-blue-500 mr-4" target="_blank" rel="noopener noreferrer">Ссылка на GitHub</a>
          <a href="https://github.com/open-data-kazakhstan/city-population/blob/1050c4217988a6eb1526198061b36b942cb3997b/data/city_population.csv" className="bg-blue-500 text-white px-4 py-2 rounded-lg" download>Скачать датасет</a>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://raw.githubusercontent.com/TyuninaA/VercelTesting/177d66a2442bc9649fb8431a95f138e8b681965e/city_population.csv');

  const text = await res.text()
  const data = {
    populations: Papa.parse(text)
  }
  return { props: { data } }
}
