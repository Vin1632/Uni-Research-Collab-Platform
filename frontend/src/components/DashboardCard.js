import React from 'react';
import '../styles/Dashboard.css';
const DashboardCard = ({ title, subtitle }) => (
  <article className="border p-4 text-center shadow hover:shadow-lg cursor-pointer w-40">
    <h2 className="font-semibold">{title}</h2>
    {subtitle && <p className="italic text-sm">{subtitle}</p>}
  </article>
);

export default DashboardCard;
