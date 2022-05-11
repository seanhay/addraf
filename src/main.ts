export {}

type addressData = {
  message: string
  results: {
    address1: string
    address2: string
    address3: string
    kana1: string
    kana2: string
    kana3: string
    prefcode: string
    zipcode: string
  }[]
  status: number
}

function addraf(formSelector: string) {
  const theForm: HTMLElement = document.querySelector(formSelector)
  const postcodeInput: HTMLInputElement = theForm.querySelector('[postcode]')
  const prefectureInput: NodeList = theForm.querySelectorAll('[prefecture]')
  const cityInput: NodeList = theForm.querySelectorAll('[city]')
  const addressInput: NodeList = theForm.querySelectorAll('[address1]')
  const prefectureKanaInput: NodeList = theForm.querySelectorAll('[prefectureKana]')
  const cityKanaInput: NodeList = theForm.querySelectorAll('[cityKana]')
  const addressKanaInput: NodeList = theForm.querySelectorAll('[address1Kana]')

  const allInputs: Array<NodeList> = [
    prefectureInput,
    cityInput,
    addressInput,
    prefectureKanaInput,
    cityKanaInput,
    addressKanaInput
  ]

  const init = () => {
    postcodeInput.addEventListener('input', (e) => {
      // Strip all non-numeric chars from string
      const element = e.target as HTMLInputElement
      const val = element.value.replace(/\D/g, '')

      // Don't lookup if length not 7 digits
      if (val.length !== 7) return false

      getPostcodeData(val).then((data: addressData) => {
        console.log(data)
        if (data.status == 200) {
          const results = data.results[0]
          // All together
          allInputs.forEach((inputList) =>
            inputList.forEach((input) => {
              const inputElement = input as HTMLInputElement
              inputElement.value = ''
            })
          )
          // Kanji
          prefectureInput.forEach((input) => {
            const inputElement = input as HTMLInputElement
            inputElement.value += results.address1
          })
          cityInput.forEach((input) => {
            const inputElement = input as HTMLInputElement
            inputElement.value += results.address2
          })
          addressInput.forEach((input) => {
            const inputElement = input as HTMLInputElement
            inputElement.value += results.address3
          })
          // Kana
          prefectureKanaInput.forEach((input) => {
            const inputElement = input as HTMLInputElement
            inputElement.value += fullWidth(results.kana1)
          })
          cityKanaInput.forEach((input) => {
            const inputElement = input as HTMLInputElement
            inputElement.value += fullWidth(results.kana2)
          })
          addressKanaInput.forEach((input) => {
            const inputElement = input as HTMLInputElement
            inputElement.value += fullWidth(results.kana3)
          })
        }
      })
    })

    // Lookup data from zipcloud API
    const getPostcodeData = async (postcode: string) => {
      const response = await fetch(
        'https://zipcloud.ibsnet.co.jp/api/search?' +
        new URLSearchParams({ zipcode: postcode }),
        {
          method: 'get'
        }
      )
      return response.json()
    }

    // Convert halfwidth kana to fullwidth kana
    const fullWidth = (str: string) => {
      return str.normalize('NFKC')
    }
  }

  init()
}
