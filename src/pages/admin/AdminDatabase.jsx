import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, AlertTriangle, Database, CheckCircle2, Trash2, Copy, Terminal } from 'lucide-react';
import Swal from 'sweetalert2';
import EditorModule from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { supabase } from '../../lib/supabaseClient';
import './AdminDatabase.css';

// Manual definition to bypass hoisting issues in production
if (typeof window !== 'undefined') {
  window.Prism = Prism;
  Prism.languages.sql = {
    'comment': {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
      lookbehind: true
    },
    'variable': [
      {
        pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
        greedy: true
      },
      /@[\w.$]+/
    ],
    'string': {
      pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
      greedy: true,
      lookbehind: true
    },
    'identifier': {
      pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /^`|`$/
      }
    },
    'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
    'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
    'boolean': /\b(?:FALSE|NULL|TRUE)\b/i,
    'number': /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
    'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    'punctuation': /[;[\]()`,.]/
  };
}

// Handle ESM/CJS interop issues with Vite
const Editor = EditorModule.default || EditorModule;

const AdminDatabase = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleExecute = async () => {
    if (!query.trim()) return;

    const confirm = await Swal.fire({
      title: 'Execute SQL?',
      text: "Running direct SQL can modify or drop your database tables. Proceed with caution!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Execute'
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    setResult(null);

    try {
      // Calls the custom RPC function created in Supabase
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
      
      if (error) throw error;
      
      setResult({
        success: true,
        data: data || 'Query executed successfully. No data returned.'
      });
      Swal.fire('Success', 'SQL Query executed successfully!', 'success');
    } catch (err) {
      console.error(err);
      setResult({
        success: false,
        error: err.message
      });
      Swal.fire('Execution Failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-database">
      <div className="section-header">
        <div className="title-group">
          <Database className="text-accent" size={28} />
          <div>
            <h2>SQL Command Center</h2>
            <p className="text-secondary">Direct database manipulation via RPC</p>
          </div>
        </div>
      </div>

      <motion.div 
        className="admin-card database-card" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="danger-banner">
          <div className="banner-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="banner-content">
            <h4>Security Warning</h4>
            <p>Direct SQL execution is powerful and dangerous. Always backup data before running DDL commands.</p>
          </div>
        </div>

        <div className="editor-container">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <Terminal size={16} />
              <span>query.sql</span>
            </div>
            <div className="toolbar-right">
              <button onClick={() => { setQuery(''); setResult(null); }} title="Clear Editor">
                <Trash2 size={16} />
              </button>
              <button onClick={() => { navigator.clipboard.writeText(query); Swal.fire({title:'Copied!', timer:1000, showConfirmButton:false}); }} title="Copy SQL">
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <Editor
            value={query}
            onValueChange={code => setQuery(code)}
            highlight={code => {
              if (!Prism.languages.sql) {
                return code; // Fallback if Prism/SQL is not loaded
              }
              return Prism.highlight(code, Prism.languages.sql, 'sql');
            }}
            padding={20}
            placeholder="-- Type your SQL here..."
            className="sql-prism-editor"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: '14px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              minHeight: '300px',
              outline: 'none'
            }}
          />
        </div>

        <div className="editor-footer">
          <p className="hint">Shortcut: Cmd/Ctrl + Enter to run</p>
          <button 
            type="button" 
            className="run-btn" 
            onClick={handleExecute}
            disabled={loading || !query.trim()}
          >
            {loading ? <div className="loader-sm"></div> : <Play size={18} />}
            <span>{loading ? 'Executing...' : 'Execute Query'}</span>
          </button>
        </div>
      </motion.div>

      {result && (
        <motion.div 
          className={`result-card ${result.success ? 'success' : 'error'}`}
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="result-header">
            <div className="result-status">
              {result.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{result.success ? 'Query Successful' : 'Execution Failed'}</span>
            </div>
          </div>
          <div className="result-body">
            <pre>
              {typeof result.data === 'string' ? result.data : JSON.stringify(result.success ? result.data : result.error, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDatabase;
