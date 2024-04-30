import Chart from 'chart.js/auto';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import fetch from 'node-fetch';
import Papa from 'papaparse';
import axios from 'axios';
import md from 'markdown-it';
import hljs from 'highlight.js';

const mdParser = new md({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
}).use(require('markdown-it-highlightjs'))
  .use(require('markdown-it-table-of-contents'), {
    includeLevel: [1, 2, 3],
    containerClass: 'toc'
  });

export default function Home({ data, readmeContent }) {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedYear, setSelectedYear] = useState('2022');
  const [chartData, setChartData] = useState(null);
  const labels = ['Всего', 'Мужчины', 'Женщины'];

  const regionLabels = data.populations.data.slice(1).map(item => item[0]);
  const totalPopulations = data.populations.data.slice(1).map(item => item[1]);
  const males = data.populations.data.slice(1).map(item => item[2]);
  const females = data.populations.data.slice(1).map(item => item[3]);

  useEffect(() => {
    if (selectedRegion === '') {
      setChartData({
        labels: regionLabels,
        datasets: [
          {
            label: 'Всего',
            data: totalPopulations,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
          {
            label: 'Мужчины',
            data: males,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
          {
            label: 'Женщины',
            data: females,
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgb(255, 205, 86)',
            borderWidth: 1,
          },
        ],
      });
    } else {
      const selectedIndex = regionLabels.indexOf(selectedRegion);
      setChartData({
        labels: labels,
        datasets: [
          {
            label: selectedRegion,
            data: [totalPopulations[selectedIndex], males[selectedIndex], females[selectedIndex]],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [selectedRegion]);

  const handleChangeRegion = event => {
    setSelectedRegion(event.target.value);
  };

  const handleChangeYear = event => {
    setSelectedYear(event.target.value);
  };

  const handleDownload = async () => {
    const fileUrl = 'https://raw.githubusercontent.com/TyuninaA/VercelTesting/177d66a2442bc9649fb8431a95f138e8b681965e/city_population.csv';
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      console.log('Ответ:', response);
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'city_population.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
    }
  };

  return (
    <>
      <Head>
        <title>City Populations</title>
        <meta name="description" content="City populations dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css" />
        <style>
          {`
            .toc {
              margin: 0;
              padding: 0;
              list-style-type: none;
            }
            .toc li {
              margin-left: 1em;
            }
          `}
        </style>
      </Head>
      <main>
        <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-center text-sky-800">
          Население городов Казахстана по регионам
        </h3>
        <div className="flex justify-left items-center mb-4" style={{ marginLeft: '28%' }}>
          <div className="mr-2">
            <select
              className="border border-gray-300 rounded-md p-2"
              value={selectedRegion}
              onChange={handleChangeRegion}
            >
              <option value="">Выберите регион</option>
              {regionLabels.map(label => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-md p-2"
              value={selectedYear}
              onChange={handleChangeYear}
            >
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
        <div className="w-full mx-auto mb-4" style={{ width: '80%' }}>
          {chartData && (
            <Bar
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Население городов Казахстана по регионам',
                    font: {
                      size: 16,
                    },
                  },
                  legend: {
                    display: true,
                    position: 'bottom',
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
              data={chartData}
              height={800}
            />
          )}
        </div>
        <div className="w-full mx-auto mb-4">
          <h4 className="text-xl font-semibold mb-2 text-center">Данные из Датасета в таблице</h4>
          <div className="overflow-x-auto">
            <div className="flex justify-center mb-2 mx-auto">
              <button onClick={handleDownload} className="bg-white-500 text-white px-4 py-2 rounded-lg">
                <img src="/downloading.png" alt="Download" width="32" height="32" />
              </button>
            </div>
            <table className="table-auto border-collapse border border-gray-400 mx-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Регион</th>
                  <th className="border border-gray-400 px-4 py-2">Всего</th>
                  <th className="border border-gray-400 px-4 py-2">Мужчины</th>
                  <th className="border border-gray-400 px-4 py-2">Женщины</th>
                </tr>
              </thead>
              <tbody>
                {data.populations.data.slice(1).map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="border border-gray-400 px-4 py-2">{row[0]}</td>
                    <td className="border border-gray-400 px-4 py-2">{row[1]}</td>
                    <td className="border border-gray-400 px-4 py-2">{row[2]}</td>
                    <td className="border border-gray-400 px-4 py-2">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end mt-4 mx-auto">
          <a href="https://github.com/open-data-kazakhstan/city-population.git" className="bg-white-500 text-white px-4 py-2 rounded-lg" target="_blank" rel="noopener noreferrer">
            <img src="/github.png" alt="GitHub" width="32" height="32" />
          </a>
        </div>
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: mdParser.render(readmeContent) }} />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch('https://api.github.com/repos/TyuninaA/DoD/contents/README.md');
  const readme = await res.json();
  const readmeContent = Buffer.from(readme.content, 'base64').toString('utf8'); // Декодируем содержимое из base64

  const csvRes = await fetch('https://raw.githubusercontent.com/TyuninaA/VercelTesting/177d66a2442bc9649fb8431a95f138e8b681965e/city_population.csv');
  const csvText = await csvRes.text();
  const data = {
    populations: Papa.parse(csvText),
  };

  return { props: { data, readmeContent } };
}
