import TechnicianJobCard from './TechnicianJobCard'

function TechnicianJobsList({ jobs, deletingJobId, onEdit, onDelete }) {
    const sortedJobs = [...jobs].sort((a, b) => {
        const firstDate = a.serviceDate ? new Date(a.serviceDate).getTime() : 0
        const secondDate = b.serviceDate ? new Date(b.serviceDate).getTime() : 0

        return secondDate - firstDate
    })

    return (
        <section className="technician-jobs-list">
            <div className="technician-jobs-list__stack">
                {sortedJobs.map((job, index) => (
                    <TechnicianJobCard
                        key={job.id}
                        job={job}
                        itemNumber={index + 1}
                        isDeleting={deletingJobId === job.id}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </section>
    )
}

export default TechnicianJobsList