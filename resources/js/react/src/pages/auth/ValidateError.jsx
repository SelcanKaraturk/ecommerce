
export default function ValidateError(errors, field, margin = "0") {

 return (
        errors?.[field]?.length
            ? errors[field].map((error, index) => (
                <div key={index} style={{marginTop : margin}} className="text-danger small">{error}</div>
              ))
            : null
    );
}

