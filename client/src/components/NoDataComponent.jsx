const NoDataMessage =({message})=>{

    return (
        <div className="text-center w-full p-4 rounded-full bg-muted text-muted-foreground mt-4">
            <p>{message}</p>
        </div>
    )
}

export default NoDataMessage;