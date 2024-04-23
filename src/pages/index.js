import Head from 'next/head'
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2'
import fetch from 'node-fetch'
import Papa from 'papaparse'
import Chart from 'chart.js/auto';

export default function Home({ data }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showTotal, setShowTotal] = useState(true);
  const [showMales, setShowMales] = useState(true);
  const [showFemales, setShowFemales] = useState(true);

  const regionLabels = data.populations.data.slice(1).map(item => item[0]);
  const totalPopulations = data.populations.data.slice(1).map(item => item[1]);
  const males = data.populations.data.slice(1).map(item => item[2]);
  const females = data.populations.data.slice(1).map(item => item[3]);

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

  let filteredRegionIndex = null;
  if (selectedRegion) {
    filteredRegionIndex = regionLabels.findIndex(label => label === selectedRegion);
  }

  const selectedData = [];
  const selectedLabels = [];
  if (showTotal) {
    selectedLabels.push('Всего');
    selectedData.push(totalPopulations[filteredRegionIndex]);
  }
  if (showMales) {
    selectedLabels.push('Мужчины');
    selectedData.push(males[filteredRegionIndex]);
  }
  if (showFemales) {
    selectedLabels.push('Женщины');
    selectedData.push(females[filteredRegionIndex]);
  }

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
        {selectedRegion && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-1/2 mb-4">
              <Bar
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: selectedRegion,
                      font: {
                        size: 14
                      }
                    },
                    legend: {
                      display: true,
                      position: 'bottom'
                    }
                  },
                  responsive: true
                }}
                data={{
                  labels: selectedLabels,
                  datasets: [
                    {
                      label: 'Население',
                      data: selectedData,
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 205, 86, 0.2)'
                      ],
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb()'
                      ],
                      borderWidth: 1
                    }
                  ]
                }}
              />
            </div>
            <div className="w-1/2">
              <h4 className="text-xl font-semibold mb-2">Данные по выбранному региону:</h4>
              <table className="table-auto border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">Показатель</th>
                    <th className="border border-gray-400 px-4 py-2">Значение</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLabels.map((label, index) => (
                    <tr key={label}>
                      <td className="border border-gray-400 px-4 py-2">{label}</td>
                      <td className="border border-gray-400 px-4 py-2">{selectedData[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
