import { useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';

export default function App() {
  const [usernameInput, setUsernameInput] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const trimmed = usernameInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a GitHub username.');
      setUserData(null);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const response = await axios.get(`https://api.github.com/users/${trimmed}`);
      setUserData(response.data);
    } catch (err) {
      setUserData(null);
      if (err.response && err.response.status === 404) {
        setErrorMsg('User not found.');
      } else {
        setErrorMsg('Failed to fetch user details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>GitHub User Finder</h1>
        <p className={styles.subtitle}>
          Search a GitHub username to see profile details.
        </p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            name="username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="e.g. torvalds, gaearon, octocat"
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

        {!userData && !errorMsg && (
          <div className={styles.emptyState}>
            No user yet. Try searching for &quot;octocat&quot;.
          </div>
        )}

        {userData && (
          <div className={styles.profileCard}>
            <img
              src={userData.avatar_url}
              alt={userData.login}
              className={styles.avatar}
            />
            <div className={styles.profileInfo}>
              <div className={styles.headerRow}>
                <span className={styles.name}>
                  {userData.name || userData.login}
                </span>
                <span className={styles.username}>@{userData.login}</span>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statBadge}>
                  <span>{userData.public_repos}</span> Repos
                </div>
                <div className={styles.statBadge}>
                  <span>{userData.followers}</span> Followers
                </div>
                <div className={styles.statBadge}>
                  <span>{userData.following}</span> Following
                </div>
              </div>

              <div className={styles.metaGrid}>
                {userData.location && (
                  <div className={styles.metaItem}>
                    📍 {userData.location}
                  </div>
                )}
                {userData.company && (
                  <div className={styles.metaItem}>
                    🏢 {userData.company}
                  </div>
                )}
                {userData.blog && (
                  <div className={styles.metaItem}>
                    🔗{' '}
                    <a
                      href={
                        userData.blog.startsWith('http')
                          ? userData.blog
                          : `https://${userData.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.metaLink}
                    >
                      {userData.blog}
                    </a>
                  </div>
                )}
                {userData.html_url && (
                  <div className={styles.metaItem}>
                    🌺{' '}
                    <a
                      href={userData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.metaLink}
                    >
                      View on GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

