
export default function ValidateError(errors, field) {

 return (
        errors?.[field]?.length
            ? errors[field].map((error, index) => (
                <div key={index} className="text-danger small">{error}</div>
              ))
            : null
    );
}

