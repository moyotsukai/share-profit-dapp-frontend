import Button from "@/components/ui/Button";

export default function NewProjectAboutSbtPage() {

  const onClickNext = () => {

  }

  return (
    <div>
      <p>Setting up SBT</p>

      <Button
        onClick={onClickNext}
        isEnabled={true}
        isLoading={false}
        style="outlined"
      >
        Next
      </Button>
    </div>
  )
}