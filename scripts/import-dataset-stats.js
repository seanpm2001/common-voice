const path = require('path');
const mysql = require('mysql');
const { parse } = require('@fluent/syntax');
const fetch = require('node-fetch');
const { promisify } = require('util');
const { getConfig } = require('../server/js/config-helper');
const dataPath = path.join(__dirname, '..', 'locales');
const localeMessagesPath = path.join(__dirname, '..', 'web', 'locales');
const fs = require('fs').promises;

const RELEASE_DIR_PATH = path.join(__dirname, 'releases');

const { MYSQLHOST, MYSQLUSER, MYSQLPASS, MYSQLDBNAME } = getConfig();

const dbConfig = {
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: MYSQLDBNAME,
};

const TOTAL_STATS = ['totalDuration', 'totalValidDurationSecs'];

const secondsToMilliseconds = seconds => seconds * 1000;

async function updateTotals(db) {
  db(`
    UPDATE datasets
    SET clips_duration = ?
    SET clips_valid_duration = ?
    WHERE id IN (?)
  `);
}

const getTotalStats = statistics => {
  return TOTAL_STATS.map(key => statistics[key]);
};

async function loadStatisticFiles() {
  const releaseFilePaths = await fs.readdir(RELEASE_DIR_PATH);

  for (const releaseFilePath of releaseFilePaths) {
    const statisticsPath = path.join(RELEASE_DIR_PATH, releaseFilePath);

    const statistics = JSON.parse(await fs.readFile(statisticsPath, 'utf-8'));
    let totalReleaseStats = getTotalStats(statistics);
    totalReleaseStats[1] = secondsToMilliseconds(totalReleaseStats[1]);
    console.log('totalReleaseStats', totalReleaseStats);
    // break;
  }
}

async function importLocales() {
  try {
    const pool = mysql.createPool(dbConfig);

    pool.getConnection(async (err, connection) => {
      if (err) throw err;
      const db = promisify(connection.query).bind(connection);
      let locales = {};

      await db(`select * from locales`);

      connection.destroy();
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

loadStatisticFiles().catch(e => console.error(e));
