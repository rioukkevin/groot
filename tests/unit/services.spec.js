import MUSIC from '@/services/music'
import PROJECT from '@/services/project'

// music Service

describe('Music Services', () => {
  it('get', () => {
    // Params
    const id = 'billy'
    // Actions
    const result = MUSIC.get(id)
    // test result
    expect(result).toEqual(expect.objectContaining({
      title: expect.any(String),
      link: expect.any(String),
    }))
  })
  it('next', () => {
    // Params
    const id = 'sum41'
    // Actions
    const result = MUSIC.next(id)
    // test result
    expect(result).toEqual(expect.objectContaining({
      title: expect.any(String),
      link: expect.any(String),
    }))
  })
  it('previous', () => {
    // Params
    const id = 'totololo'
    // Actions
    const result = MUSIC.previous(id)
    // test result
    expect(result).not.toEqual(expect.objectContaining({
      title: expect.any(String),
      link: expect.any(String),
    }))
  })
})

// project services

const PROJECT_MODEL = {
  title: expect.any(String),
  description: expect.any(String),
  job: expect.any(String),
  technologies: expect.any([expect.any(String)]),
  colors: expect.any([expect.any(String)]),
  details: expect.any([expect.objectContaining({
    type: expect.any(String),
    title: expect.any(String),
    image: expect.any(String),
    description: expect.any(String),
  })])
}

describe('Project Services', () => {
  it('get', () => {
    // Params
    const id = 'perso2020'
    // Actions
    const result = PROJECT.get(id)
    // test result
    expect(result).toEqual(PROJECT_MODEL)
  })
  // it('next', () => {
  //   // Params
  //   const id = 'perso2019'
  //   // Actions
  //   const result = PROJECT.next(id)
  //   // test result
  //   expect(result).toEqual(expect.objectContaining({
  //     title: expect.any(String),
  //     link: expect.any(String),
  //   }))
  // })
  // it('previous', () => {
  //   // Params
  //   const id = 'totololo'
  //   // Actions
  //   const result = PROJECT.previous(id)
  //   // test result
  //   expect(result).not.toEqual(expect.objectContaining({
  //     title: expect.any(String),
  //     link: expect.any(String),
  //   }))
  // })
})
