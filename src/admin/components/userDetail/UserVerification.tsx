interface Props {
  user: any;
}

export default function UserVerification({ user }: Props) {
  const verified = user?.verified === true;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          Verification
        </h2>

        <span
          style={{
            background: verified ? "#16a34a" : "#dc2626",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "999px",
            fontWeight: 700,
            letterSpacing: ".5px",
          }}
        >
          {verified ? "VERIFIED" : "NOT VERIFIED"}
        </span>
      </div>

      {/* STATUS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="glass-card"
          style={{ padding: "1rem" }}
        >
          <strong>Verification Status</strong>

          <div style={{ marginTop: ".5rem" }}>
            {verified
              ? "Approved"
              : "Pending / Not Verified"}
          </div>
        </div>

        <div
          className="glass-card"
          style={{ padding: "1rem" }}
        >
          <strong>Selfie Submitted</strong>

          <div style={{ marginTop: ".5rem" }}>
            {(user?.selfieSubmitted ?? false)
              ? "Yes"
              : "No"}
          </div>
        </div>

        <div
          className="glass-card"
          style={{ padding: "1rem" }}
        >
          <strong>Verification Date</strong>

          <div style={{ marginTop: ".5rem" }}>
            {user?.verifiedAt
              ? new Date(
                  user.verifiedAt
                ).toLocaleString()
              : "Not Available"}
          </div>
        </div>

        <div
          className="glass-card"
          style={{ padding: "1rem" }}
        >
          <strong>Verified By</strong>

          <div style={{ marginTop: ".5rem" }}>
            {user?.verifiedBy || "System"}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1rem",
        }}
      >
        <button
          className="btn-gold"
          onClick={() => {
            console.log(
              "Approve verification:",
              user.id
            );
          }}
        >
          Approve Verification
        </button>

        <button
          className="btn-gold"
          onClick={() => {
            console.log(
              "Reject verification:",
              user.id
            );
          }}
        >
          Reject Verification
        </button>

        <button
          className="btn-gold"
          onClick={() => {
            console.log(
              "Remove verification:",
              user.id
            );
          }}
        >
          Remove Verification
        </button>

        <button
          className="btn-gold"
          onClick={() => {
            console.log(
              "View selfie:",
              user.id
            );
          }}
        >
          View Selfie
        </button>
      </div>
    </div>
  );
}