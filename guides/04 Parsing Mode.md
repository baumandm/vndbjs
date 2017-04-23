
With parsing mode enabled, vndbjs will return slightly altered results compared to the raw output of VNDB.org.  Each item returns is iterated over and improved.  

## Goals

1. Improve the quality and human readability of VNDB's information
2. Make minimal changes to the structure of the responses
3. Produce an output that will allow clients to do minimal processing themselves
4. Allow the feature to be turned off, if desired.

Keep in mind that this conversion process is based on the contents of `reference.js`, and while I've strived to enter as much information there as possible, I have *likely* missed some items.  Vndbjs is *designed* to insert the original data if it cannot find a conversion for it, so you should not experience any loss of data, but you may encouter unconverted data from time to time.  If possible, please send me a message or open an issue on GitLab or Github, or make a pull request to Gitlab, if you come across any issues.

The next few documents will be comparisons between unparsed and parsed responses for the available data types.