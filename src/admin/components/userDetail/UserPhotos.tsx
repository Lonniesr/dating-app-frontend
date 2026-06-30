interface Props {
  photos?: string[];
}

export default function UserPhotos({ photos = [] }: Props) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          Photos
        </h2>

        <span
          style={{
            color: "#d4af37",
            fontWeight: 700,
          }}
        >
          {photos.length}
        </span>
      </div>

      {photos.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--lynq-text-muted)",
          }}
        >
          No photos uploaded.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(180px,1fr))",
            gap: "1rem",
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                overflow: "hidden",
                borderRadius: "16px",
                transition: "transform .2s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "230px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Primary Badge */}
                {index === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "#d4af37",
                      color: "#111",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: ".75rem",
                      fontWeight: 700,
                    }}
                  >
                    PRIMARY
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: ".9rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  Photo {index + 1}
                </div>

                <button
                  className="btn-gold"
                  style={{
                    padding: "6px 12px",
                    fontSize: ".8rem",
                  }}
                  onClick={() => window.open(photo, "_blank")}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}