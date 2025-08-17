import React from 'react';

function Likes({ item, onLike, id, onDisLike }) 
 {
    // const isLiked = item.isLiked?.includes(id) ?? false;
    
  return (
    <div>
      <button onClick={() => onLike()} style={styles.button} >
        👍 {item?.likes}
      </button>
      &nbsp;&nbsp;
      <button style={styles.button} onClick={() => onDisLike()}>
        👎 {item?.dislikes}
      </button>
    </div>
  );
}

const styles = {
  button: {
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px 10px',
    userSelect: 'none',
  },
};

export default Likes;
