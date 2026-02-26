import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Style/Records.css';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function Records() {
  const email = localStorage.getItem('userEmail');
  const now   = new Date();

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [statusFilter,  setStatusFilter]  = useState('All');
  const [searchDate,    setSearchDate]    = useState('');

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Build year options from 2024 to current year
  const currentYear = now.getFullYear();
  const years = [];
  for (let y = 2024; y <= currentYear; y++) years.push(y);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/monthly/records?email=${email}&month=${selectedMonth}&year=${selectedYear}`
      );
      setRecords(res.data.records);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  }, [email, selectedMonth, selectedYear]);

  useEffect(() => {
    if (email) fetchRecords();
  }, [fetchRecords]);

  // Client-side filtering
  const filtered = records.filter(r => {
    const statusMatch = statusFilter === 'All' || r.status === statusFilter;
    const searchMatch =
      searchDate.trim() === '' ||
      r.formattedDate.toLowerCase().includes(searchDate.toLowerCase()) ||
      r.dayName.toLowerCase().includes(searchDate.toLowerCase());
    return statusMatch && searchMatch;
  });

  const attendanceRate = summary && summary.totalRecords > 0
    ? Math.round((summary.presentCount / summary.totalRecords) * 100)
    : 0;

  return (
    <div className="RecordsPage">
      <div className="RecordsInner">

        {/* ── Header ── */}
        <div className="RecordsHeader">
          <div className="RecordsBadge">Attendance History</div>
          <h1 className="RecordsTitle">
            Your <span>Records</span>
          </h1>
          <div className="RecordsDivider" />
          <p className="RecordsSubtitle">
            Track every day, filter by month, search your history.
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="RecordsControls">
          <div className="ControlGroup">
            <label>Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(parseInt(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>

          <div className="ControlGroup">
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="ControlGroup">
            <label>Status</label>
            <div className="FilterBtns">
              {['All', 'Present', 'Absent'].map(s => (
                <button
                  key={s}
                  className={`FilterBtn ${statusFilter === s ? 'active-' + s.toLowerCase() : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="ControlGroup SearchGroup">
            <label>Search</label>
            <input
              type="text"
              placeholder="e.g. Monday, Feb, 2025..."
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
          </div>
        </div>

        {/* ── Summary Chips ── */}
        {summary && (
          <div className="RecordsSummary">
            <div className="SummaryChip chip-total">
              <span className="ChipValue">{summary.totalRecords}</span>
              <span className="ChipLabel">Days Logged</span>
            </div>
            <div className="SummaryChip chip-present">
              <span className="ChipValue">{summary.presentCount}</span>
              <span className="ChipLabel">Present</span>
            </div>
            <div className="SummaryChip chip-absent">
              <span className="ChipValue">{summary.absentCount}</span>
              <span className="ChipLabel">Absent</span>
            </div>
            <div className="SummaryChip chip-rate">
              <span className="ChipValue">{attendanceRate}%</span>
              <span className="ChipLabel">Attendance Rate</span>
            </div>
          </div>
        )}

        {/* ── Rate Bar ── */}
        {summary && (
          <div className="RateBarWrap">
            <div className="RateBarTrack">
              <div className="RateBarFill" style={{ width: `${attendanceRate}%` }} />
            </div>
            <span className="RateBarLabel">{summary.month} {summary.year}</span>
          </div>
        )}

        {/* ── Table ── */}
        <div className="RecordsTableWrap">
          {loading ? (
            <div className="RecordsLoading">
              <div className="Spinner" />
              <p>Loading records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="NoRecords">
              <span className="NoRecordsIcon">📭</span>
              <p>No records found for the selected filters.</p>
            </div>
          ) : (
            <table className="RecordsTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.date}
                    className={r.status === 'Present' ? 'row-present' : 'row-absent'}
                  >
                    <td className="RowNum">{i + 1}</td>
                    <td className="RowDay">{r.dayName}</td>
                    <td className="RowDate">{r.formattedDate}</td>
                    <td className="RowWeight">{r.weight}<span>kg</span></td>
                    <td>
                      <span className={`StatusBadge badge-${r.status.toLowerCase()}`}>
                        {r.status === 'Present' ? '✅ Present' : '❌ Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Result count ── */}
        {!loading && filtered.length > 0 && (
          <p className="ResultCount">
            Showing <strong>{filtered.length}</strong> of <strong>{records.length}</strong> records
          </p>
        )}

      </div>
    </div>
  );
}

export default Records;