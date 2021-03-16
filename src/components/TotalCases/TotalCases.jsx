import React from "react";
import styles from "./TotalCases.module.scss";

const TotalCases = (api) => (
  <div className={styles.sheet__wrapper}>
    <table>
      <thead>
        <tr>
          <th>Global cases</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{api.data.data.cases}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default TotalCases;
