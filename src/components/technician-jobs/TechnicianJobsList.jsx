import TechnicianJobCard from './TechnicianJobCard'

function TechnicianJobsList({ jobs, onEdit, onDelete }) {
    return (
        <section className="technician-jobs-list">
            <div className="technician-jobs-list__grid">
                {jobs.map((job) => (
                    <TechnicianJobCard
                        key={job.id}
                        job={job}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </section>
    )
}

export default TechnicianJobsList