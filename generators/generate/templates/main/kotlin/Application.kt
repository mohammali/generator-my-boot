package <%= packageSignature %>

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@ConfigurationPropertiesScan
@SpringBootApplication
class Main

fun main(args: Array<String>) {
  runApplication<Main>(*args)
}
